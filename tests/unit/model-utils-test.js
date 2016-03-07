/* globals describe:true, it:true, beforeEach:true */
"use strict";
var assert = require('chai').assert;
var models = require('../../models');
// const ModelUtils = require('../../utils/model-utils');
var model_utils_1 = require('../../utils/model-utils');
describe("unit: user model-utils", function () {
    it("dash singular name", function () {
        var modelUtil = new model_utils_1.ModelUtils(models.ErrorLog);
        assert.equal("error-log", modelUtil.dashSingularName);
    });
    it("dash plural name", function () {
        var modelUtil = new model_utils_1.ModelUtils(models.ErrorLog);
        assert.equal("error-logs", modelUtil.dashPluralName);
    });
});
//# sourceMappingURL=model-utils-test.js.map