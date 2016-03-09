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
            .then(() => models.Client.remove({}))
            .then(() => {
                return user.save()
                    .then(() => {
                        done(null);
                    });
            })
            .catch(done);
    });


    it("post client", function(done){
        request.post('/api/v1/clients')
            .auth("test", "test1234")
            .send({
                client: {
                    name:"new client app",
                    description:"this is the new client app",
                    clientIdentifier:"client identifier",
                    secret:"client secret",
                }
            })
            .expect(200)
            .end(function(err,res){
                assert.equal(null,err);
                // assert.equal("name", res.body.user.firstname);
                // assert.equal("lastName", res.body.user.lastname);
                // assert.equal("postedUser", res.body.user.username);
                // assert.notEqual("mypassword", res.body.user.password);
                done(err);
            });
    });



});