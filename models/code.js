/**
 * Code model module.
 * @module models/code
 */
"use strict";

const mongoose = require("mongoose");
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
    }
});

/**
 * Mongoose Code model
 * @type {Model}
 */
const Code = mongoose.model('Code', CodeSchema);

module.exports = Code;