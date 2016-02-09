"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

class UserRoute extends RouteBase {
	constructor(app){ 
		super(app, models.User, models.ErrorLog);
	}

	createRoutes(){
		super.createGetOneRoute();
		super.createGetManyRoute();
		super.createPostRoute({authenticate:false});
		// super.createPutRoute();
		// super.createDeleteRoute();
		
		this.router.put(this.putRoutePath, this.isAuthenticated, this.isSelf, this.putRouteMiddleware);
		this.router.delete(this.deleteRoutePath, this.isAuthenticated, this.isSelf, this.deleteRouteMiddleware);
	}
	
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
