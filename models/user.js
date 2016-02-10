/**
 * user model module
 * @module models/user
 */
"use strict"; 

const mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

/**
 * Mongoose sub schema for applications that a user can access
 * @type {Schema}
 */
const ApplicationUserSchema = new Schema({
	appId: Schema.Types.ObjectId,
});

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
const User = mongoose.model('User', UserSchema);

module.exports = User;