"use strict";
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);


const skipFiles = [basename, "route-base.js"];

function loadRoutes(app){
	fs.readdirSync(__dirname)
		.filter(function(file) {
		  	return (file.indexOf('.') !== 0) && !_.includes(skipFiles,file);
		})
		.forEach(function(file) {
			console.log(file);
		    const basename = path.basename(file, '.js');
		    const RouterClass = require('./' + basename);
		    const router = new RouterClass(app);
		    app.use('/api/v1/' + basename, router.router);
		});

};

module.exports = loadRoutes;
