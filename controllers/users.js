/**
 * users module.
 * @module routes/users
 */
"use strict";

const ModelControllerBase = require('./base/model-controller-base');
const models = require('../models');

/**
 * UserController is a class that creates an express router with GET,POST,PUT,and DELETE.
 */
class UserController extends ModelControllerBase {

	/**
	 * @param  {object} app express application object
	 */
	constructor(app){
		super(app, models.User, models.ErrorLog);
	}

	/**
	 * the creatRoutes function creates all of the routes for the class
	 * @return {Void}
	 */
	createRoutes(){
		super.createGetOneRoute();
		super.createGetManyRoute();
		super.createPostRoute({authenticate:false});
		// super.createPutRoute();
		// super.createDeleteRoute();

		// this.router.get(this.getOneRoutePath, this.isAuthenticated, this.getOneMiddleware, this.resultMiddleware);

		this.router.put(this.putRoutePath, this.isAuthenticated, this.isSelf, this.putRouteMiddleware);
		this.router.delete(this.deleteRoutePath, this.isAuthenticated, this.isSelf, this.deleteRouteMiddleware);
	}

	/**
	 * @param  {object} express request object
	 * @param  {object} express response object
	 * @param  {Function} callback
	 * @return {Void}
	 */
	isSelf(req, res, next){
		const userId = req.user._id.toString();
		const requestId = req.params.id;

		if(requestId !== userId){
			return res.status(401).send(`user ${userId} cannot modify user ${requestId}`);
		} else {
			next(null);
		}
	}


}

module.exports = UserController;
