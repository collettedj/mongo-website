"use strict";

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../models/user');

function authenticate(username, password, callback) {
    User.findOne({ userName: username }, function (err, user) {
        if (err) { return callback(err); }
        
        // No user found with that username
        if (!user) { return callback(null, false); }
        
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
          if (err) { return callback(err); }
        
          // Password did not match
          if (!isMatch) { return callback(null, false); }
        
          // Success
          return callback(null, user);
        });
    });
}

passport.use(new BasicStrategy(authenticate));

module.exports = {
    isAuthenticated: passport.authenticate('basic', { session : false }),
    authenticate: authenticate
};


