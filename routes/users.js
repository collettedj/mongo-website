/**
 * users module.
 * @module routes/users
 */
"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

/**
 * UserRoute is a class that creates an express route with GET,POST,PUT,and DELETE.
 */
class UserRoute extends RouteBase {

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

module.exports = UserRoute;
