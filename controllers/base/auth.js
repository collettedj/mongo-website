/**
 * auth module.
 * @module routes/auth
 */
"use strict";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../../models').User;
const Client = require('../../models').Client;
const Token = require('../../models').Token;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function(user){
            done(null, user);
        })
        .catch(function(error){
            done(error, null);
        });
});

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

function authenticateClient(username, password, callback) {
  Client.findOne({ clientIdentifier: username }, function (err, client) {
    if (err) { return callback(err); }

    // No client found with that id or bad password
    if (!client || client.secret !== password) { return callback(null, false); }

    // Success
    return callback(null, client);
  });
}

function authenticateAccessToken(accessToken, callback) {
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

passport.use(new BasicStrategy(authenticate));
// passport.use(new LocalStrategy(authenticate));
passport.use('client-basic', new BasicStrategy(authenticateClient));
passport.use(new BearerStrategy(authenticateAccessToken));

/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */
exports.authenticate = authenticate;
exports.authenticateClient = authenticateClient;
exports.authenticateAccessToken = authenticateAccessToken;

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : true });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : true });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: true });
