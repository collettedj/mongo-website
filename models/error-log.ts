/**
 * application model module.
 * @module models/error-log
 */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Mongoose schema for error logs
 * @type {Schema}
 */
const ErrorLogSchema = new Schema({
    message: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        expires: 60 * 60 * 24 * 7,
        required: true,
    }
});

/**
 * Mongoose model for error logs
 * @type {Model}
 */
const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = ErrorLog;