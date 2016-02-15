/**
 * Client module.
 * @module routes/Clients
 */
"use strict";

const ModelControllerBase = require('./base/model-controller-base');
const models = require('../models');

/**
 * ClientController is a class that creates an express route with GET,POST,PUT,and DELETE.
 */
class ClientController extends ModelControllerBase {

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
		// super.createPostRoute();
		super.createPutRoute();
		super.createDeleteRoute();

		this.router.post(this.postRoutePath, this.isAuthenticated, this.setUserIdMiddleware, this.postRouteMiddleware);
	}

	/**
	 * set the user id on the body so that it will be set when the model get inserted into the database
	 *
	 */
	get setUserIdMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;
		return (req, res, next) => {
			req.body[bodyPath].userId = req.user._id;
			next();
		};
	}

}

module.exports = ClientController;
