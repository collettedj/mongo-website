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
import * as mongoose from 'mongoose';
import * as debug from 'debug';

const dbconf = require('../config/dbconf');
const debugserver = debug('mongo-website:models');

const env = process.env.NODE_ENV || "development";
const mongoUrl = dbconf.mongo[env];

if(!mongoUrl){
	throw Error(`Could not get mongodb connection string for environment ${env}`);
}

mongoose.connect(mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  debugserver("connected to mongo database");
});

export {Client} from './client';
export {Token} from './token';
export {Code} from './code';
export {User} from './user';
export {ErrorLog} from './error-log';

export function initModels(){

}
