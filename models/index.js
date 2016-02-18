/**
 * Mongoose index module. This module loads all models in the same folder.
 * It also creates the connection to the mongo database throught the 
 * config/dbconf.js file. All mongoose models can loaded by using require('./models')
 * @module models/index
 */
"use strict";

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dbconf = require('../config/dbconf');
const debug = require('debug')('mongo-website:models');

const env = process.env.NODE_ENV || "development";
const mongoUrl = dbconf.mongo[env];

if(!mongoUrl){
	throw Error(`Could not get mongodb connection string for environment ${env}`);
}


mongoose.connect(mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  debug("connected to mongo database");
});

const basename = path.basename(module.filename);
const skipFiles = [basename];

function loadModels(){
	const models = {};

	fs.readdirSync(__dirname)
		.filter(function(file) {
		  	return (file.indexOf('.') !== 0) && !_.includes(skipFiles,file);
		})
		.forEach(function(file) {
		    const basename = path.basename(file, '.js');
		    const Model = require('./' + basename);
		    models[Model.modelName] = Model;
		});
	return models;
}

module.exports = loadModels();