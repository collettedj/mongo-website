"use strict";

const RouteBase = require('./route-base');

class UserRoute extends RouteBase {
	constructor(app){
		super(app);
	}

	createRoutes(){
		router.get('/', function(req, res, next) {
		  res.send('respond with a resource');
		});
	}

}

module.exports = UserRoute;
