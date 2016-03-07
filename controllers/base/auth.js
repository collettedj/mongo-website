/**
 * auth module.
 * @module routes/auth
 */
"use strict";
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var models_1 = require('../../models');
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    models_1.User.findById(id)
        .exec()
        .then(function (user) {
        done(null, user);
    })
        .catch(function (error) {
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
    try {
        models_1.User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } }, function (err, user) {
            if (err) {
                return callback(err);
            }
            // No user found with that username
            if (!user) {
                return callback(null, false, "could not find user or password");
            }
            // User has been locked out
            if (user.isLockedOut) {
                return callback(null, false, "your account has been locked out");
            }
            // Make sure the password is correct
            user.verifyPassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }
                // Password did not match
                if (!isMatch) {
                    return user.incrementBadPasswordAttempts(function (err, updatedUser) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, false, "could not find user or password");
                    });
                }
                // Success
                return user.resetBadPasswordAttempts(function (err, updatedUser) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, updatedUser);
                });
            });
        });
    }
    catch (err) {
        console.log("got the error");
        console.log(err);
    }
}
exports.authenticate = authenticate;
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
    models_1.User.findOne({ 'username': username })
        .exec()
        .then(function (foundUser) {
        if (foundUser) {
            return done(null, false, "User already exists with username: " + username);
        }
        var user = new models_1.User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: username,
            password: password,
        });
        return user.save()
            .then(function (savedUser) {
            done(null, savedUser);
        });
    })
        .catch(function (err) {
        return done(err);
    });
}
exports.authenticateSignup = authenticateSignup;
function authenticateClient(username, password, callback) {
    models_1.Client.findOne({ clientIdentifier: username }, function (err, client) {
        if (err) {
            return callback(err);
        }
        // No client found with that id or bad password
        if (!client || client.secret !== password) {
            return callback(null, false);
        }
        // Success
        return callback(null, client);
    });
}
exports.authenticateClient = authenticateClient;
function authenticateAccessToken(accessToken, callback) {
    models_1.Token.findOne({ value: accessToken }, function (err, token) {
        if (err) {
            return callback(err);
        }
        // No token found
        if (!token) {
            return callback(null, false);
        }
        models_1.User.findOne({ _id: token.userId }, function (err, user) {
            if (err) {
                return callback(err);
            }
            // No user found
            if (!user) {
                return callback(null, false);
            }
            // Simple example with no scope
            callback(null, user, { scope: '*' });
        });
    });
}
exports.authenticateAccessToken = authenticateAccessToken;
passport.use(new BasicStrategy(authenticate));
passport.use('login', new LocalStrategy(authenticate));
passport.use('signup', new LocalStrategy({ passReqToCallback: true }, authenticateSignup));
passport.use('client-basic', new BasicStrategy(authenticateClient));
passport.use(new BearerStrategy(authenticateAccessToken));
/**
 * This module exports the isAuthenticated passport middlewares
 * @type {Object}
 */
exports.isAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    passport.authenticate(['basic', 'bearer'], { session: false })(req, res, next);
};
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: true });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: true });
//# sourceMappingURL=auth.js.map