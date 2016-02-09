"use strict";

const express = require('express');
const ModelUtils = require('../utils/model-utils');
const isAuthenticated = require('./auth').isAuthenticated;

class RouteBase{
	constructor(app, Model, ErrorLog){
		this.app = app;
		this.router = express.Router(); 
		this.Model = Model;
		this.ErrorLog = ErrorLog;
		this.modelUtils = new ModelUtils(Model);

		if(this.createRoutes){
			this.createRoutes();	
		} else {
			throw new Error("you must define the createRoutes method");
		}		
	}
	
	sendErrorResponse(res, err){
		const errorLog = new this.ErrorLog({
			message: err.stack,
			createdAt: new Date(),
		});
		return errorLog.save()
			.catch(err => {
				console.log("failed to save error to log", err.stack);
			})
			.then(() => {
				res.status(500).send(err.message);		
			});			
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
					return this.sendErrorResponse(res, err);
				});
		});
	}

	createGetManyRoute(){
		const responsePath = this.modelUtils.dashPluralName;

		this.router.get('/', (req, res, next) => {
			this.Model.find()
				.then(model => {
					const result = {
						[responsePath]: model
					};
				  	res.json(result);
				})
				.catch(err => {
					return this.sendErrorResponse(res, err);
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
					return this.sendErrorResponse(res, err);
				});
		});
	}
	
	createPutRoute(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;

		this.router.put('/', (req, res, next) => {
			const body = req.body[bodyPath];
			console.log("body id", body._id);
			this.Model.findOneAndUpdate({_id: body._id}, {$set: body}, {new:true, runValidators: true})
				.then(savedModel => {
					if(!savedModel){
						return res.status(404).send(`${this.Model.modelName} ${body._id} not found`);
					}					
					const result = {
						[responsePath]: savedModel
					};
				  	res.json(result);
				})
				.catch(err => {
					return this.sendErrorResponse(res, err);
				});
		});
	}

}

module.exports = RouteBase;
