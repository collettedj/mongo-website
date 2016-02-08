"use strict";

var express = require('express');

class RouteBase{
	constructor(app, Model){
		this.app = app;
		this.router = express.Router();
		console.log(Model);
		this.Model = Model;

		if(this.createRoutes){
			this.createRoutes();	
		} else {
			throw new Error("you must define the createRoutes method");
		}		
	}
 
	createPostRoute(bodyPath, responsePath){
		this.router.post('/', (req, res, next) => {
			const body = req.body[bodyPath];
			console.log(body);
			const model = new this.Model(body);
			model.save()
				.then(savedModel => {
					const result = {};
				  	result[responsePath] = {test: "got this value"};
				  	res.json(result);
				})
				.catch(err => {
					res.status(500).send(err.stack);
				})

			
		});
	}

}

module.exports = RouteBase;
