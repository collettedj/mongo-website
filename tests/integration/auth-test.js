/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');
const authenticate = require('../../routes/auth').authenticate;

describe("integration: auth", function(){
    beforeEach(function(done){
        const user = new models.User({
           firstName:"first",
           lastName:"last",
           userName:"test",
           password:"test1234",
        });
        
        models.User.remove({})
            .then(() => {
                return user.save()
                    .then(() => {
                        done(null);
                    });              
            })
            .catch(done);
    });
    
    it("authenticate user success", function(done){

        authenticate("test", "test1234", (err, user) => {
            assert.equal(null,err);
            assert.notEqual(null, user);
            assert.notEqual(undefined, user);
            done(err);    
        });
        
    });
    
    it("authenticate bad password failure", function(done){

        authenticate("test", "abc1234", (err, user) => {
            assert.equal(null,err);
            assert.equal(false, user);
            models.User.findOne({userName:"test"})
                .then(foundUser => {
                    assert.equal(1, foundUser.badPasswordAttempts);
                    done(err);
                })
                .catch(done);  
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
});