/**
 * user model module
 * @module models/user
 */
"use strict"; 

const mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
let User = null;

/**
 * Mongoose sub schema for applications that a user can access
 * @type {Schema}
 */
const ApplicationUserSchema = new Schema({
	appId: Schema.Types.ObjectId,
});

/**
 * Mongoose schema to define user models
 * @type {Schema}
 */
const UserSchema = new Schema({


	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		index: true,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	badPasswordAttempts: {
		type: Number,
		default:0,
		required:true,
	},
	isLockedOut: {
		type: Boolean,
		default:false,
		required:true,
	},


	apps:[ApplicationUserSchema],

});

/**
 * User model method to verify password against hash value
 * @param  {password}
 * @param  {Function}
 * @return {Void}
 */
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
    	return cb(err);
    }
    cb(null, isMatch);
  });
};

/**
 * increment the badPasswordAttempts when user enters incorrect password
 * @param  {Function} callback
 */
UserSchema.methods.incrementBadPasswordAttempts = function(cb) {
	User.findOneAndUpdate({ _id: this._id }, { $inc: { badPasswordAttempts: 1 } }, {new:true}, (err, updatedUser) => {
		if(err){return cb(err);	}
		
		if(updatedUser.badPasswordAttempts >= 3){
			updatedUser.isLockedOut = true;
			return updatedUser.save((err, lockedUser) => {
				if(err){return cb(err);	}
				return cb(null, lockedUser);			
			});
		}
		
		return cb(null, updatedUser);
	});
};

/**
 * set bad password attempts back to zero
 * @param  {Function} callback
 */
UserSchema.methods.resetBadPasswordAttempts = function(cb) {
	User.findOneAndUpdate({ _id: this._id }, { $set: { badPasswordAttempts: 0 } }, {new:true}, (err, updatedUser) => {
		if(err){return cb(err);	}
		return cb(null, updatedUser);
	});
};

/**
 * hash passwords
 * @param  {Function} callback for async hashing of password
 * @return {Void}
 */
UserSchema.methods.hashPassword = function(callback) {
	var user = this;

	// Break out if the password hasn't changed
	if (!user.isModified('password')){
		return callback();
	} 

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function(err, salt) {
		if (err) {
			return callback(err);
		}

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return callback(err);
			}
			user.password = hash;
			callback();
		});
	});
};

UserSchema.pre('save', UserSchema.methods.hashPassword);


/**
 * Mongoose user model
 * @type {Model}
 */
User = mongoose.model('User', UserSchema);

module.exports = User;