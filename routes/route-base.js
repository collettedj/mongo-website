"use strict";

var express = require('express');

class RouteBase{
	constructor(app){
		this.app = app;
		this.router = express.Router();

		if(this.createRoutes){
			this.createRoutes();	
		} else {
			throw new Error("you must define the createRoutes method");
		}
		
	}

}

module.exports = RouteBase;
