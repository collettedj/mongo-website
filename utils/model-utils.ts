/**
 * model utils module.
 * @module utils/model-utils
 */
"use strict";
import {Model} from 'mongoose';
const inflection = require('inflection');

/**
 * class to handle utility function for Mongoose models
 */
class ModelUtils{
	/**
	 * @param  {Model} Mongoose model
	 * @return {Void}
	 */
	constructor(public Model: Model<any>){
		this.Model = Model;
	}

	/**
	 * convert the model name to the singular dasherized name
	 * @return {string} the singular dasherized model name
	 */
	get dashSingularName(){
		const dashSingularName = inflection.transform( this.Model.modelName, [ 'underscore', 'dasherize', 'singularize' ]).toLowerCase();
		return dashSingularName;
	}

	/**
	 * convert the model name to the plural dasherized name
	 * @return {string} the plural dasherized model name
	 */
	get dashPluralName(){
		const dashSingularName = inflection.transform( this.Model.modelName, [ 'underscore', 'dasherize', 'pluralize' ]).toLowerCase();
		return dashSingularName;
	}
}

export = ModelUtils;