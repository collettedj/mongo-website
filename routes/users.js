"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

class UserRoute extends RouteBase {
	constructor(app){ 
		super(app, models.User, models.ErrorLog);
	}

	createRoutes(){
		super.createGetOneRoute({authenticate:true});
		super.createGetManyRoute({authenticate:true});
		super.createPutRoute({authenticate:true});
		super.createPostRoute();
	}

}

module.exports = UserRoute;
