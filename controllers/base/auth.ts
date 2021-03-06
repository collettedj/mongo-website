/**
 * auth module.
 * @module routes/auth
 */
"use strict";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
import {User, Client, Token} from '../../models';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    (User.findById(id)
        .exec()
        .then(function(user){
            done(null, user);
        }) as any)
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
    try{
        User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }, function(err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false, "could not find user or password"); }

            // User has been locked out
            if ((<any>user).isLockedOut) { return callback(null, false, "your account has been locked out"); }

            // Make sure the password is correct
            (<any>user).verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) {
                    return (<any>user).incrementBadPasswordAttempts((err, updatedUser) => {
                        if (err) { return callback(err); }
                        return callback(null, false, "could not find user or password");
                    });
                }

                // Success
                return (<any>user).resetBadPasswordAttempts((err, updatedUser) => {
                    if (err) { return callback(err); }
                    return callback(null, updatedUser);
                });

            });
        });
    }catch(err){
        console.log("got the error");
        console.log(err);
    }

}

/**
 * Authenticate a user when signing up. That way the user doea not have to register and
 * then log in
 * @param  {Request}  req      Express request object
 * @param  {String}   username users username
 * @param  {String}   password user's password
 * @param  {Function} done     callback
 * @return {Void}              [description]
 */
function authenticateSignup(req, username, password, done) {
    (User.findOne({'username':username})
        .exec()
        .then(foundUser => {
            if(foundUser){
                return done(null, false, `User already exists with username: ${username}`);
            }

            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: username,
                password: password,
            });
            return (<any>user).save()
                .then(savedUser => {
                    done(null, savedUser);
                });
        }) as any)
        .catch(err => {
            return done(err);
        });
}

function authenticateClient(username, password, callback) {
  Client.findOne({ clientIdentifier: username }, function (err, client:any) {
    if (err) { return callback(err); }

    // No client found with that id or bad password
    if (!client || client.secret !== password) { return callback(null, false); }

    // Success
    return callback(null, client);
  });
}

function authenticateAccessToken(accessToken, callback) {
  Token.findOne({value: accessToken }, function (err, token:any) {
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
passport.use('login', new LocalStrategy(authenticate));
passport.use('signup', new LocalStrategy({passReqToCallback : true}, authenticateSignup));
passport.use('client-basic', new BasicStrategy(authenticateClient));
passport.use(new BearerStrategy(authenticateAccessToken));

/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */

export {
    authenticate,
    authenticateSignup,
    authenticateClient,
    authenticateAccessToken
};

export const isAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    passport.authenticate(['basic', 'bearer'], {session: false})(req, res, next);
};

export const isClientAuthenticated = passport.authenticate('client-basic', { session : true });
export const isBearerAuthenticated = passport.authenticate('bearer', { session: true });
