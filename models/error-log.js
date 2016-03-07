/**
 * application model module.
 * @module models/error-log
 */
"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
/**
 * Mongoose schema for error logs
 * @type {Schema}
 */
var ErrorLogSchema = new Schema({
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
exports.ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);
//# sourceMappingURL=error-log.js.map