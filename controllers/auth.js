/**
 * auth module.
 * @module routes/auth
 */
"use strict";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
const User = require('../models').User;
const Client = require('../models').Client;
const Token = require('../models').Token;

/**
 * Expresss middlware to implement basic authentication
 * @param  {string} username 
 * @param  {string} password
 * @param  {Function} callback
 * @return {Void}
 */
function authenticate(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
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

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));


/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */
exports.authenticate = authenticate;

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
