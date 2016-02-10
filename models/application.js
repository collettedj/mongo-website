/**
 * application model module.
 * @module models/application
 */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema to for applications
 * @type {Schema}
 */
const ApplicationSchema = new Schema({
	name: {
		type: String,
	},

	description: {
		type: String,
	},

	roles:[
		{
			name: String,
			description: String,
		}
	]

});


/**
 * Mongoose application model
 * @type {Model}
 */
const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;