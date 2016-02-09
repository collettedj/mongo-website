const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);

module.exports = ErrorLog;