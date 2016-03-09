/* globals describe:true, it:true, beforeEach:true */
"use strict";

declare const describe: any;
declare const it: any;
declare const beforeEach: any;

import {assert} from 'chai';
const app = require('../../app');
const request = require('supertest').agent(app);
const models = require('../../models');

describe("integration: user routes", function(){
    beforeEach(function(done){
        const user = new models.User({
           firstname:"first",
           lastname:"last",
           username:"test",
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
                       assert(Array.isArray(res.body.clients));
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
                            firstname: newFirstName
                        }
                    })
                    .expect(200)
                    .end(function(err,res){
                       assert.equal(null,err);
                       assert.equal(userId, res.body.user._id);
                       assert.equal(newFirstName, res.body.user.firstname);
                       done(err);
                    });
            })
            .catch(done);
    });

    it("post user 404", function(done){
        request.post('/api/v1/users')
            .auth("test", "test1234")
            .send({
                user: {
                    firstname:"firstName",
                    lastname:"lastName",
                    username:"postedUser",
                    password:"mypassword",
                }
            })
            .expect(404,done);
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