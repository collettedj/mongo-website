/**
 * Code model module.
 * @module models/code
 */
"use strict";

import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Mongoose schema to for Codes
 * @type {Schema}
 */
const CodeSchema = new Schema({
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
        type:String,
        required: true
    }]
});

/**
 * Mongoose Code model
 * @type {Model}
 */
export const Code = mongoose.model('Code', CodeSchema);
