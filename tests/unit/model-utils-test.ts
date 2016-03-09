/* globals describe:true, it:true, beforeEach:true */
"use strict";

declare const describe: any;
declare const it: any;
declare const beforeEach: any;

import {assert} from 'chai';
const models = require('../../models');
// const ModelUtils = require('../../utils/model-utils');
import {ModelUtils} from '../../utils/model-utils';


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