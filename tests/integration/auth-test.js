/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const jwt = require('jwt-simple');
const models = require('../../models');
const authenticate = require('../../controllers/base/auth').authenticate;
const authenticateSignup = require('../../controllers/base/auth').authenticateSignup;
const authenticateClient = require('../../controllers/base/auth').authenticateClient;
const authenticateAccessToken = require('../../controllers/base/auth').authenticateAccessToken;
const oauth2mid = require('../../controllers/base/oauth2-middleware');

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
            clientIdentifier:"test_id",
        });

        const code = models.Code({
            value: "test_code",
            redirectUri: "http://localhost:3000",
            // userId:
            // clientId:
            scope:['openid', 'profile']
        });

        const token = models.Token({
            value: "test_token_value",
        });

        models.User.remove({})
            .then( () => models.Client.remove({}) )
            .then( () => models.Token.remove({}) )
            .then( () => models.Code.remove({}) )
            .then( () => {
                return user.save();
            })
            .then( savedUser => {
                client.userId = savedUser._id;
                return client.save()
                .then( savedClient => {
                    token.userId = savedUser._id;
                    token.clientId = savedClient._id;
                    code.userId = savedUser._id;
                    code.clientId = savedClient._id;
                    return Promise.all([token.save(), code.save()]);
                });
            })

            .then(() => {
                done(null);
            })
            .catch(done);
    });

    describe("authenticate user", function(){

        it("signup user", function(done){
            const req = {
                body: {
                    firstname: "first",
                    lastname: "last",
                }
            };

            authenticateSignup(req, "new_user", "new_password", (err, user) => {
                assert.equal(null,err);
                assert.equal("new_user", user.username);
                assert.equal("first", user.firstname);
                assert.equal("last", user.lastname);

                return models.User.findOne({username:"new_user"})
                    .then(foundUser => {
                        assert.equal("new_user", foundUser.username);
                        assert.equal("first", foundUser.firstname);
                        assert.equal("last", foundUser.lastname);
                        done();
                    })
                    .catch(done);
            });

        });

        it("signup with existing username", function(done){
            const req = {
                body: {
                    firstname: "first",
                    lastname: "last",
                }
            };

            authenticateSignup(req, "test", "new_password", (err, user) => {
                assert.equal(null,err);
                assert.equal(false, user);
                done();
            });

        });

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
        it("success", function(done){
            authenticateClient("test_id", "test_secret", (err, client) => {
                assert.equal(null,err);
                assert.notEqual(null, client);
                assert.notEqual(undefined, client);
                assert.notEqual(false, client);
                done(err);
            });
        });

        it("failure", function(done){
            authenticateClient("test_id", "bad_secret", (err, client) => {
                assert.equal(null,err);
                assert.equal(false, client);
                done(err);
            });
        });
    });

    describe("authenticate access token", function(){
        it("success", function(done){
            authenticateAccessToken("test_token_value", (err, client) => {
                assert.equal(null,err);
                assert.notEqual(null, client);
                assert.notEqual(undefined, client);
                assert.notEqual(false, client);
                done(err);
            });
        });

        it("failure", function(done){
            authenticateAccessToken("bad token", (err, client) => {
                assert.equal(null,err);
                assert.equal(false, client);
                done(err);
            });
        });
    });

    describe("oauth2", function(){
        it("grant code success", function(done){
            Promise.all([models.Client.findOne({}),
                models.User.findOne({})])
                .then(res => {
                    const client = res[0];
                    const user = res[1];
                    return new Promise(function(resolve,reject){
                        oauth2mid.grantCode(client, "http://localhost:/3000", user, {}, {}, function(err, code){
                            if(err){
                                return reject(err);
                            }
                            return resolve(code);
                        });
                    });
                })
                .then(code => {
                    assert.notEqual(null, code);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        function exchangeCodePromise(client, clientIdentifier, redirectUri){
            return new Promise(function(resolve,reject){
                oauth2mid.exchangeCode(client, clientIdentifier, redirectUri, function(err, accessToken, refreshToken, idToken){
                    if(err){
                        return reject(err);
                    }
                    return resolve({
                        client:client.toJSON(),
                        accessToken,
                        refreshToken,
                        idToken
                    });
                });
            });
        }

        it("exchange code success", function(done){
            Promise.all([models.Client.findOne({}),
                models.User.findOne({})])
                .then(res => {
                    const client = res[0];
                    const user = res[1];
                    return exchangeCodePromise(client, "test_code", "http://localhost:3000");
                })
                .then(tokens => {
                    assert.notEqual(null, tokens.accessToken);
                    assert.equal(null, tokens.refreshToken);
                    assert.notEqual(null, tokens.idToken);
                    const date = new Date();
                    const decodedIdToken = jwt.decode(tokens.idToken, tokens.client.secret);

                    assert.equal(tokens.client.clientIdentifier, decodedIdToken.aud);
                    assert.isBelow(date, new Date(decodedIdToken.exp));
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("exchange code bad client code", function(done){
            Promise.all([models.Client.findOne({}),
                models.User.findOne({})])
                .then(res => {
                    const client = res[0];
                    const user = res[1];
                    return exchangeCodePromise(client, "bad_code", "http://localhost:3000");
                })
                .then(tokens => {
                    assert.equal(false, tokens.accessToken);
                    assert.equal(undefined, tokens.refreshToken);
                    assert.equal(undefined, tokens.idToken);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("exchange code bad redirect uri", function(done){
            Promise.all([models.Client.findOne({}),
                models.User.findOne({})])
                .then(res => {
                    const client = res[0];
                    const user = res[1];
                    return exchangeCodePromise(client, "test_code", "http://localhost:4444");
                })
                .then(tokens => {
                    assert.equal(false, tokens.accessToken);
                    assert.equal(undefined, tokens.refreshToken);
                    assert.equal(undefined, tokens.idToken);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });


    });


});