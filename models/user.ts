/**
 * user model module
 * @module models/user
 */
"use strict";

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

/**
 * Mongoose sub schema for roles that a user is a member of
 * @type {Schema}
 */
const ClientUserRoleSchema = new Schema({
	role: {
		type: Schema.Types.ObjectId,
		ref: "Client.roles._id"
	}
});

/**
 * Mongoose sub schema for clients that a user can access
 * @type {Schema}
 */
const ClientUserSchema = new Schema({
	app: {
		type: Schema.Types.ObjectId,
		ref: "Client",
	},

	roles: [ClientUserRoleSchema],
});

/**
 * Mongoose schema to define user models
 * @type {Schema}
 */
const UserSchema = new Schema({

	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	username: {
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


	apps:[ClientUserSchema],

});

/**
 * User model method to verify password against hash value
 * @param  {password}
 * @param  {Function}
 * @return {Void}
 */
(<any>UserSchema).methods.verifyPassword = function(password, cb) {
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
(<any>UserSchema).methods.incrementBadPasswordAttempts = function(cb) {
	User.findOneAndUpdate({ _id: this._id }, { $inc: { badPasswordAttempts: 1 } }, {new:true}, (err, updatedUser:any) => {
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
(<any>UserSchema).methods.resetBadPasswordAttempts = function(cb) {
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
(<any>UserSchema).methods.hashPassword = function(callback) {
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

UserSchema.pre('save', (<any>UserSchema).methods.hashPassword);


/**
 * Mongoose user model
 * @type {Model}
 */
export const User = mongoose.model('User', UserSchema);