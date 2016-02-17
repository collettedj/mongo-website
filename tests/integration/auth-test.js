/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');
const authenticate = require('../../controllers/base/auth').authenticate;
const authenticateClient = require('../../controllers/base/auth').authenticateClient;

describe("integration: auth", function(){
    beforeEach(function(done){
        const user = new models.User({
           firstname:"first",
           lastname:"last",
           username:"test",
           password:"test1234",
        });

        const client = models.Client({
            name: "test app",
            description: "test app",
            secret:"test_secret",
            clientId:"test_id",
        });

        models.User.remove({})
            .then( () => models.Client.remove({}) )
            .then( () => {
                return user.save();
            })
            .then( savedUser => {
                client.userId = savedUser._id;
                return client.save();
            })
            .then(() => {
                done(null);
            })
            .catch(done);
    });

    describe("authenticate user", function(){
        it("authenticate user success", function(done){

            authenticate("test", "test1234", (err, user) => {
                assert.equal(null,err);
                assert.notEqual(null, user);
                assert.notEqual(undefined, user);
                assert.notEqual(false, user);
                done(err);
            });

        });

        it("authenticate bad password failure", function(done){

            authenticate("test", "abc1234", (err, user) => {
                if(err){ return done(err); }
                authenticate("test", "abc1234", (err, user) => {
                    if(err){ return done(err); }
                    authenticate("test", "abc1234", (err, user) => {
                        if(err){ return done(err); }
                        assert.equal(null,err);
                        assert.equal(false, user);
                        models.User.findOne({username:"test"})
                            .then(foundUser => {
                                assert.equal(3, foundUser.badPasswordAttempts);
                                assert.equal(true, foundUser.isLockedOut);
                                return done(err);
                            })
                            .catch(done);
                    });

                });
            });

        });

        it("authenticate unkown user failure", function(done){

            authenticate("baduser", "abc1234", (err, user) => {
                assert.equal(null,err);
                assert.equal(false, user);
                done(err);
            });

        });

        it("authenticate bad input failure", function(done){

            authenticate(undefined, null, (err, user) => {
                assert.equal(null,err);
                assert.equal(false, user);
                done(err);
            });

        });

        it("successful login resets bad password attempts", function(done){

            models.User.findOneAndUpdate({ username: "test" }, { $set: { badPasswordAttempts:2 } }, {new:true} )
                .then(updatedUser => {
                    assert.equal(false, updatedUser.isLockedOut);
                    assert.equal(2, updatedUser.badPasswordAttempts);

                    authenticate("test", "test1234", (err, user) => {
                        assert.equal(null,err);
                        assert.notEqual(false, user);
                        assert.equal(0, user.badPasswordAttempts);
                        return done();
                    });
                })
                .catch(done);

        });
    });

    describe("authenticate client", function(){
        it("authenticate client success", function(done){
            authenticateClient("test_id", "test_secret", (err, client) => {
                assert.equal(null,err);
                assert.notEqual(null, client);
                assert.notEqual(undefined, client);
                assert.notEqual(false, client);
                done(err);
            });
        });

        it("authenticate client failure", function(done){
            authenticateClient("test_id", "bad_secret", (err, client) => {
                assert.equal(null,err);
                assert.equal(false, client);
                done(err);
            });
        });
    });


});