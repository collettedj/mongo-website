/**
 * Token model module.
 * @module models/Token
 */
"use strict";

import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Mongoose schema to for Tokens
 * @type {Schema}
 */
const TokenSchema = new Schema({
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
const Token = mongoose.model('Token', TokenSchema);

export = Token;