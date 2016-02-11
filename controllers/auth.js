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
        if (!user) { return callback(null, false, "could not find user or password"); }
        
        // User has been locked out
        if(user.isLockedOut) { return callback(null, false, "your account has been locked out"); }
        
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
            if (err) { return callback(err); }

            // Password did not match
            if (!isMatch) { 
                return user.incrementBadPasswordAttempts((err, updatedUser) => {
                    if (err) { return callback(err); }
                    return callback(null, false, "could not find user or password");
                });
            }
            
            // Success
            return user.resetBadPasswordAttempts((err, updatedUser) => {
                    if (err) { return callback(err); }
                    return callback(null, updatedUser);
            });

        });
    });
}

passport.use(new BasicStrategy(authenticate));

/**
 * Passport middleware to implement basic authentication
 * @type {Middleware}
 */
const isAuthenticated = passport.authenticate('basic', { session : false });


// const isAuthenticated = function(req, res, next){
//      passport.authenticate('basic', { session : false }, function(err, user, info){
//         if(err) { return next(err); }
        
//         if(!user){
//             res.status(401).send(info);
//         } else {
//             req.user = user;
//             next();
//         }
//      })(req, res, next);
// };

/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */
module.exports = {
    isAuthenticated: isAuthenticated,
    authenticate: authenticate
};


