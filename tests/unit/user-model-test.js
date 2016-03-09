/* globals describe:true, it:true, beforeEach:true */
"use strict";
const chai_1 = require('chai');
const models = require('../../models');
describe("unit: user models", function () {
    it("hash password", function (done) {
        const password = 'testpassword';
        const user = new models.User({
            password: password
        });
        user.hashPassword((err) => {
            chai_1.assert.equal(null, err);
            chai_1.assert.notEqual(password, user.password);
            user.verifyPassword(password, (err, isMatch) => {
                chai_1.assert.equal(null, err);
                chai_1.assert.ok(isMatch);
                done(err);
            });
        });
    });
});
//# sourceMappingURL=user-model-test.js.map