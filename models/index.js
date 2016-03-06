/**
 * Mongoose index module. This module loads all models in the same folder.
 * It also creates the connection to the mongo database throught the
 * config/dbconf.js file. All mongoose models can loaded by using require('./models')
 * @module models/index
 */
"use strict";
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var debug = require('debug');
var dbconf = require('../config/dbconf');
var debugserver = debug('mongo-website:models');
var env = process.env.NODE_ENV || "development";
var mongoUrl = dbconf.mongo[env];
if (!mongoUrl) {
    throw Error("Could not get mongodb connection string for environment " + env);
}
mongoose.connect(mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    debugserver("connected to mongo database");
});
var basename = path.basename(module.filename);
var skipFiles = [basename];
function loadModels() {
    var models = {};
    fs.readdirSync(__dirname)
        .filter(function (file) {
        return (file.indexOf('.') !== 0) && path.extname(file).toLowerCase() === ".js" && !_.includes(skipFiles, file);
    })
        .forEach(function (file) {
        var basename = path.basename(file, '.js');
        var Model = require('./' + basename);
        models[Model.modelName] = Model;
    });
    return models;
}
module.exports = loadModels();
//# sourceMappingURL=index.js.map