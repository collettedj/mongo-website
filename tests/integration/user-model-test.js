/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');

describe("integration: user model", function(){

	beforeEach(function(done){
        const user = new models.User({
           firstname:"first",
           lastname:"last",
           username:"test",
           password:"test1234",
        });

        Promise.all([
        	models.User.remove({}),
        	models.Client.remove({})
        	])
            .then(() => {
                done(null);
            })
            .catch(done);
    });

    it("populate client from user", function(done){
    	const client = models.Client({
    		name: "test app",
    		description: "test app",
    		clientIdentifier:"test_id",
    		secret:"test_secret",
    		userId:"test_user_id",
    	});

    	const user = new models.User({
    		firstname:"first",
    		lastname:"last",
    		username:"username",
    		password:"test1234",
    	});

    	client.save()
    		.then(app => {
    			user.apps.push({app:app._id});
    			return user.save();
    		})
    		.then(user => {
    			return models.User
    				.findOne({_id:user._id})
    				.populate('apps.app')
    				.exec();
    		})
    		.then(popUser => {
    			assert.equal("test app", popUser.apps[0].app.name);
    			done();
    		})
    		.catch(done);
    });

});