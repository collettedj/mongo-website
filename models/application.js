/**
 * application model module.
 * @module models/application
 */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose sub schema for roles in an application
 * @type {Schema}
 */
const RoleSchema = new Schema({
	name: String,
	description: String,
});

/**
 * Mongoose schema to for applications
 * @type {Schema}
 */
const ApplicationSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},

	description: {
		type: String,

	},

	roles:[RoleSchema],

});

/**
 * Mongoose application model
 * @type {Model}
 */
const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;