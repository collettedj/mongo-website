/**
 * Token model module.
 * @module models/Token
 */
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Mongoose schema to for Tokens
 * @type {Schema}
 */
var TokenSchema = new Schema({
    value: {
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
    }
});
/**
 * Mongoose Token model
 * @type {Model}
 */
exports.Token = mongoose.model('Token', TokenSchema);
//# sourceMappingURL=token.js.map