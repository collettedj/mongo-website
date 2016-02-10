/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');
const ModelUtils = require('../../utils/model-utils');

describe("unit: user model-utils", function(){

    it("dash singular name", function(){
    	const modelUtil = new ModelUtils(models.ErrorLog);
    	assert.equal("error-log", modelUtil.dashSingularName);
    });

    it("dash plural name", function(){
    	const modelUtil = new ModelUtils(models.ErrorLog);
    	assert.equal("error-logs", modelUtil.dashPluralName);
    });

});