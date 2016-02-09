/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const app = require('../../app');
const request = require('supertest').agent(app);
const models = require('../../models');

describe("integration: user routes", function(){
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
    
    it("get many users", function(done){
        request.get('/api/v1/users')
            .auth("test", "test1234")
            .expect(200)
            .end(function(err,res){
               assert.equal(null,err);
               assert.equal(1, res.body.users.length);
               done(err);
            });
    });
    
    it("get one user", function(done){
        models.User.find()
            .then(users => {
                const userId = users[0]._id;
                request.get('/api/v1/users/' + userId)
                    .auth("test", "test1234")
                    .expect(200)
                    .end(function(err,res){
                       assert.equal(null,err);
                       assert.equal(userId, res.body.user._id);
                       done(err);
                    });                
            })
            .catch(done);
    });
    
    it("put user", function(done){
        const newFirstName = "newFirstName";
        
        models.User.find()
            .then(users => {
                const userId = users[0]._id;
                request.put('/api/v1/users/' + userId)
                    .auth("test", "test1234")
                    .send({
                        user: {
                            firstName: newFirstName
                        }
                    })
                    .expect(200)
                    .end(function(err,res){
                       assert.equal(null,err);
                       assert.equal(userId, res.body.user._id);
                       assert.equal(newFirstName, res.body.user.firstName);
                       done(err);
                    });                
            })
            .catch(done);
    });  
    
    it("post user", function(done){
        request.post('/api/v1/users')
            .auth("test", "test1234")
            .send({
                user: {
                    firstName:"firstName",
                    lastName:"lastName",
                    userName:"postedUser",
                    password:"mypassword",
                }
            })
            .expect(200)
            .end(function(err,res){
               assert.equal(null,err);
               assert.equal("firstName", res.body.user.firstName);
               assert.equal("lastName", res.body.user.lastName);
               assert.equal("postedUser", res.body.user.userName);
               assert.notEqual("mypassword", res.body.user.password);
               done(err);
            });
    });  
    
    it("delete user", function(done){
        models.User.find()
            .then(users => {
                const userId = users[0]._id;
                request.delete('/api/v1/users/' + userId)
                    .auth("test", "test1234")
                    .expect(204,done);
            })
            .catch(done);
    });      
    

});