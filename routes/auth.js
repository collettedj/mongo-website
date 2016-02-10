/**
 * auth module.
 * @module routes/auth
 */
"use strict";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../models').User;

/**
 * Expresss middlware to implement basic authentication
 * @param  {string} username 
 * @param  {string} password
 * @param  {Function} callback
 * @return {Void}
 */
function authenticate(username, password, callback) {
    User.findOne({ userName: username }, function (err, user) {
        if (err) { return callback(err); }
        
        // No user found with that username
        if (!user) { return callback(null, false); }
        
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
            if (err) { return callback(err); }

            // Password did not match
            if (!isMatch) { 
                return User.findOneAndUpdate({ _id: user._id }, { $inc: { badPasswordAttempts: 1 } }, {new:true})
                    .then(foundUser =>{
                        callback(null, false);
                    })
                    .catch(err => {
                        callback(err);
                    });
            }

            // Success
            return callback(null, user);
        });
    });
}

passport.use(new BasicStrategy(authenticate));

/**
 * Passport middleware to implement basic authentication
 * @type {Middleware}
 */
const isAuthenticated = passport.authenticate('basic', { session : false });

/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */
module.exports = {
    isAuthenticated: isAuthenticated,
    authenticate: authenticate
};


