"use strict";

const express = require('express');
const ModelUtils = require('../utils/model-utils');

class RouteBase{
	constructor(app, Model){
		this.app = app;
		this.router = express.Router(); 
		this.Model = Model;
		this.modelUtils = new ModelUtils(Model);

		if(this.createRoutes){
			this.createRoutes();	
		} else {
			throw new Error("you must define the createRoutes method");
		}		
	}

	createGetOneRoute(){
		const responsePath = this.modelUtils.dashSingularName;

		this.router.get('/:id', (req, res, next) => {
			const modelId = req.params.id;
			this.Model.findOne({_id:modelId})
				.then(model => {
					if(!model){
						return res.status(404).send(`could not find one for id ${modelId}`);
					}
					const result = {
						[responsePath]: model
					};
				  	res.json(result);
				})
				.catch(err => {
					res.status(500).send(err.stack);
				});
		});
	}

	createGetManyRoute(){
		const responsePath = this.modelUtils.dashPluralName;

		this.router.get('/', (req, res, next) => {
			const modelId = req.params.id;
			this.Model.find()
				.then(model => {
					const result = {
						[responsePath]: model
					};
				  	res.json(result);
				})
				.catch(err => {
					res.status(500).send(err.stack);
				});
		});
	}
 
	createPostRoute(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;

		this.router.post('/', (req, res, next) => {
			const body = req.body[bodyPath];
			const model = new this.Model(body);
			model.save()
				.then(savedModel => {
					const result = {
						[responsePath]: savedModel
					};
				  	res.json(result);
				})
				.catch(err => {
					res.status(500).send(err.stack);
				});
		});
	}

}

module.exports = RouteBase;
