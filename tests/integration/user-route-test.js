/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const app = require('../../app');
const request = require('supertest').agent(app);
const models = require('../../models');

describe("user routes", function(){
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
            .expect(200, done);
    });
});