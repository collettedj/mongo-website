/**
 * Client model module.
 * @module models/client
 */
"use strict";

// const mongoose = require("mongoose");
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Mongoose sub schema for roles in an Client
 * @type {Schema}
 */
const RoleSchema = new Schema({
	name: String,
	description: String,
});

/**
 * Mongoose schema to for Clients
 * @type {Schema}
 */
const ClientSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},

	description: {
		type: String,

	},

	clientIdentifier: {
		type: String,
		unique: true,
		required: true
	},

	userId: {
		type: String,
		required: true
	},

	secret: {
		type: String,
		required: true
	},

	roles:[RoleSchema],

});

/**
 * Mongoose Client model
 * @type {Model}
 */
export const Client = mongoose.model('Client', ClientSchema);
