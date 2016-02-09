"use strict";

const _ = require('lodash');
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

	get getOneRoutePath(){
		return '/:id';
	}

	get getOneMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		return (req, res, next) => {
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
		};		
	}
	
	createGetOneRoute(options){
		options = options || {};
		_.defaults(options,{authenticate:true});

		if(options.authenticate){
			this.router.get(this.getOneRoutePath, isAuthenticated, this.getOneMiddleware);
		} else {
			this.router.get(this.getOneRoutePath, this.getOneMiddleware);
		}
	}

	get getManyRoutePath(){
		return '/';
	}

	get getManyMiddleware(){
		const responsePath = this.modelUtils.dashPluralName;
		return (req, res, next) => {
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
		};
	}

	createGetManyRoute(options){
		options = options || {};
		_.defaults(options,{authenticate:true});		

		if(options.authenticate){
			this.router.get(this.getManyRoutePath, isAuthenticated, this.getManyMiddleware);
		} else {
			this.router.get(this.getManyRoutePath, this.getManyMiddleware);
		}
	}

	get postRoutePath(){
		return '/';
	}

	get postRouteMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;
		return (req, res, next) => {
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
		};
	}
 
	createPostRoute(options){
		options = options || {};
		_.defaults(options,{authenticate:true});		

		if(options.authenticate){
			this.router.post(this.postRoutePath, isAuthenticated, this.postRouteMiddleware);
		} else {
			this.router.post(this.postRoutePath, this.postRouteMiddleware);
		}
	}

	get putRoutePath(){
		return '/:id';
	}

	get putRouteMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;

		return (req, res, next) => {
			const modelId = req.params.id;
			const body = req.body[bodyPath];
			this.Model.findOneAndUpdate({_id: modelId}, {$set: body}, {new:true, runValidators: true})
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
		};
	}
	
	createPutRoute(options){
		options = options || {};
		_.defaults(options,{authenticate:true});		

		if(options.authenticate){
			this.router.put(this.putRoutePath, isAuthenticated, this.putRouteMiddleware);
		} else {
			this.router.put(this.putRoutePath, this.putRouteMiddleware);
		}
	}

}

module.exports = RouteBase;
