/**
 * Mongoose index module. This module loads all models in the same folder.
 * It also creates the connection to the mongo database throught the
 * config/dbconf.js file. All mongoose models can loaded by using require('./models')
 * @module models/index
 */
"use strict";
// import * as _ from 'lodash';
// import * as fs from 'fs';
// import * as path from 'path';
const mongoose = require('mongoose');
const debug = require('debug');
// const dbconf = require('../config/dbconf');
const dbconf_1 = require('../config/dbconf');
const debugserver = debug('mongo-website:models');
const env = process.env.NODE_ENV || "development";
const mongoUrl = dbconf_1.config.mongo[env];
if (!mongoUrl) {
    throw Error(`Could not get mongodb connection string for environment ${env}`);
}
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    debugserver("connected to mongo database");
});
var client_1 = require('./client');
exports.Client = client_1.Client;
var token_1 = require('./token');
exports.Token = token_1.Token;
var code_1 = require('./code');
exports.Code = code_1.Code;
var user_1 = require('./user');
exports.User = user_1.User;
var error_log_1 = require('./error-log');
exports.ErrorLog = error_log_1.ErrorLog;
function initModels() {
}
exports.initModels = initModels;
//# sourceMappingURL=index.js.map