"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

class UserRoute extends RouteBase {
	constructor(app){ 
		super(app, models.user);
	}

	createRoutes(){
		super.createGetOneRoute();
		super.createGetManyRoute();
		super.createPostRoute();
		super.createPutRoute();
	}

}

module.exports = UserRoute;
