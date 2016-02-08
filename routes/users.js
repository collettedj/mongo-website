"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

class UserRoute extends RouteBase {
	constructor(app){ 
		super(app, models.user);
	}

	createRoutes(){
		super.createGetOneRoute("user");
		super.createGetManyRoute("users");
		super.createPostRoute("user","user");
	}

}

module.exports = UserRoute;
