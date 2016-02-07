"use strict";

var express = require('express');

class RouteBase{
	constructor(app){
		this.app = app;
		this.router = express.Router();
	}
}

module.exports = RouteBase;
