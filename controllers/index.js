/**
 * route index module. load all routes defined in the routes folder.
 * @module routes/index
 */
"use strict";
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);
const skipFiles = [basename, "base", "auth.js"];

/**
 * @param  {string} baseRoutePath base path for every route.
 * @param  {object} app express appliation object
 * @return {Void}
 */
function loadRoutes(baseRoutePath, app){
	fs.readdirSync(__dirname)
		.filter(function(file) {
		  	return (file.indexOf('.') !== 0) && !_.includes(skipFiles,file);
		})
		.forEach(function(file) {
		    const basename = path.basename(file, '.js');
		    const ControllerClass = require('./' + basename);
		    const controller = new ControllerClass(app);
		    controller.applyControllerToRouter();
		    app.use(baseRoutePath + basename, controller.router);
		});

}

module.exports = loadRoutes;
