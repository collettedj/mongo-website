/**
 * application module.
 * @module routes/applications
 */
"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

/**
 * ApplicationRoute is a class that creates an express route with GET,POST,PUT,and DELETE.
 */
class ApplicationRoute extends RouteBase {

	/**
	 * @param  {object} app express application object
	 */
	constructor(app){ 
		super(app, models.Application, models.ErrorLog);
	}

	/**
	 * the creatRoutes function creates all of the routes for the class
	 * @return {Void}
	 */
	createRoutes(){
		super.createGetOneRoute();
		super.createGetManyRoute();
		super.createPostRoute();
		super.createPutRoute();
		super.createDeleteRoute();
	}

}

module.exports = ApplicationRoute;
