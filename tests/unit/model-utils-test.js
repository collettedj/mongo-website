/* globals describe:true, it:true, beforeEach:true */
"use strict";
const chai_1 = require('chai');
const models = require('../../models');
// const ModelUtils = require('../../utils/model-utils');
const model_utils_1 = require('../../utils/model-utils');
describe("unit: user model-utils", function () {
    it("dash singular name", function () {
        const modelUtil = new model_utils_1.ModelUtils(models.ErrorLog);
        chai_1.assert.equal("error-log", modelUtil.dashSingularName);
    });
    it("dash plural name", function () {
        const modelUtil = new model_utils_1.ModelUtils(models.ErrorLog);
        chai_1.assert.equal("error-logs", modelUtil.dashPluralName);
    });
});
//# sourceMappingURL=model-utils-test.js.map