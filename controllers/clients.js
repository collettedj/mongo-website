/**
 * Client module.
 * @module routes/Clients
 */
"use strict";

const ControllerBase = require('./controller-base');
const models = require('../models');

/**
 * ClientController is a class that creates an express route with GET,POST,PUT,and DELETE.
 */
class ClientController extends ControllerBase {

	/**
	 * @param  {object} app express Client object
	 */
	constructor(app){ 
		super(app, models.Client, models.ErrorLog);
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

module.exports = ClientController;
