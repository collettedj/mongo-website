/* globals describe:true, it:true, beforeEach:true */
"use strict";

declare const describe: any;
declare const it: any;
declare const beforeEach: any;

import {assert} from 'chai';

const models = require('../../models');

describe("unit: user models", function(){

    it("hash password", function(done){
        const password = 'testpassword';
        const user = new models.User({
           password: password
        });

        user.hashPassword((err) => {
            assert.equal(null,err);
            assert.notEqual(password, user.password);

            user.verifyPassword(password, (err, isMatch) => {
                assert.equal(null,err);
                assert.ok(isMatch);
                done(err);
            });

        });

    });
});