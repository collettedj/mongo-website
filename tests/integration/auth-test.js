/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');
const authenticate = require('../../controllers/auth').authenticate;

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
            if(err){ return done(err); }
            authenticate("test", "abc1234", (err, user) => {
                if(err){ return done(err); }
                authenticate("test", "abc1234", (err, user) => {
                    if(err){ return done(err); }
                    assert.equal(null,err);
                    assert.equal(false, user);
                    models.User.findOne({userName:"test"})
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

        models.User.findOneAndUpdate({ userName: "test" }, { $set: { badPasswordAttempts:2 } }, {new:true} )
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