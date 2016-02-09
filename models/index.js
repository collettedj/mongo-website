"use strict";

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dbconf = require('../config/dbconf');
const debug = require('debug')('mongo-website:models');

mongoose.connect(dbconf.mongo);

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