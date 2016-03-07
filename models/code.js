/**
 * Code model module.
 * @module models/code
 */
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Mongoose schema to for Codes
 * @type {Schema}
 */
var CodeSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    redirectUri: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    scope: [{
            type: String,
            required: true
        }]
});
/**
 * Mongoose Code model
 * @type {Model}
 */
exports.Code = mongoose.model('Code', CodeSchema);
//# sourceMappingURL=code.js.map