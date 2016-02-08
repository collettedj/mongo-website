"use strict";

const RouteBase = require('./route-base');
const models = require('../models');

class UserRoute extends RouteBase {
	constructor(app){ 
		super(app, models.user);
	}

	createRoutes(){
		this.router.get('/', function(req, res, next) {
		  res.send('respond with a resource');
		});
		super.createPostRoute("user","user");
	}

}

module.exports = UserRoute;
