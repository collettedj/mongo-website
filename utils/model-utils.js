"use strict";

const inflection = require('inflection');

class ModelUtils{
	constructor(Model){
		this.Model = Model;
	}

	get dashSingularName(){
		const dashSingularName = inflection.transform( this.Model.modelName, [ 'dasherize', 'singularize' ]).toLowerCase(); 
		return dashSingularName;
	}

	get dashPluralName(){
		const dashSingularName = inflection.transform( this.Model.modelName, [ 'dasherize', 'pluralize' ]).toLowerCase(); 
		return dashSingularName;
	}
}

module.exports = ModelUtils;