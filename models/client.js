/**
 * Client model module.
 * @module models/client
 */
"use strict";
// const mongoose = require("mongoose");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Mongoose sub schema for roles in an Client
 * @type {Schema}
 */
var RoleSchema = new Schema({
    name: String,
    description: String,
});
/**
 * Mongoose schema to for Clients
 * @type {Schema}
 */
var ClientSchema = new Schema({
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
    roles: [RoleSchema],
});
/**
 * Mongoose Client model
 * @type {Model}
 */
var Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
//# sourceMappingURL=client.js.map