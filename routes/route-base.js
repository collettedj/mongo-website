/**
 * RouteBase module.
 * @module routes/route-base
 */
"use strict";

const _ = require('lodash');
const express = require('express');
const ModelUtils = require('../utils/model-utils');
const isAuthenticated = require('./auth').isAuthenticated;

/**
 * RouteBase is a base class for routes that are REST services over a mongoose data model.
 */
class RouteBase{
	
	/**
	 * @param {object} app This is the express application object
	 * @param {object} Model The mongoose model that the route will use.
	 * @param {object} ErrorLog The mongoose model that is used for logging.
	 */
	constructor(app, Model, ErrorLog){
		this.app = app;
		this.router = express.Router(); 
		this.Model = Model;
		this.ErrorLog = ErrorLog;
		this.modelUtils = new ModelUtils(Model);
		this.isAuthenticated = isAuthenticated;

		if(this.createRoutes){
			this.createRoutes();	
		} else {
			throw new Error("you must define the createRoutes method");
		}		
	}
	
	/**
	 * Send a 500 response for unexptected errors. It will also log the error to the ErrorLog model that was passed in to the constructor
	 * @param {object} res express response object
	 * @param {object} error 
	 */
	sendErrorResponse(res, err){
		const errorLog = new this.ErrorLog({
			message: err.stack,
			createdAt: new Date(),
		});
		
		console.log("error response", err.stack);
		return errorLog.save()
			.catch(err => {
				console.log("failed to save error to log", err.stack);
			})
			.then(() => {
				res.status(500).send(err.message);		
			});			
	}

	/**
	 * The default path for a GET route that will get one result
	 * @returns {string}
	 */
	get getOneRoutePath(){
		return '/:id';
	}
	
	/**
	 * The default path for a GET route that will get multiple result
	 * @returns {string}
	 */
	get getManyRoutePath(){
		return '/';
	}	
	
	/**
	 * The default path for a POST route
	 * @returns {string}
	 */
	get postRoutePath(){
		return '/';
	}
	
 	/**
	 * The default path for a PUT route
	 * @returns {string}
	 */
	get putRoutePath(){
		return '/:id';
	}	
	
 	/**
	 * The default path for a DELETE route
	 * @returns {string}
	 */	
	get deleteRoutePath(){
		return '/:id';
	}	

 	/**
	 * Express middleware for a GET route that will return a single model
	 * @returns {function} an express middleware function
	 */	
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

 	/**
	 * Express middleware for a GET route that will return multiple models
	 * @returns {function} an express middleware function
	 */	
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

	/**
	 * Express middleware for a POST route that will insert a mongoose object
	 * @returns {function} an express middleware function
	 */
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
 
 	/**
	 * Express middleware for a PUT route that will update a mongoose object
	 * @returns {function} an express middleware function
	 */
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
	
 	/**
	 * Express middleware for a DELETE route that will delete a mongoose object
	 * @returns {function} an express middleware function
	 */	
	get deleteRouteMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		const bodyPath = responsePath;

		return (req, res, next) => {
			const modelId = req.params.id;
			const body = req.body[bodyPath];
			this.Model.remove({_id: modelId})
				.then(deleteModel => {
					if(!deleteModel){
						return res.status(404).send(`${this.Model.modelName} ${body._id} not found`);
					}					
				  	res.sendStatus(204);
				})
				.catch(err => {
					return this.sendErrorResponse(res, err);
				});
		};
	}
	
 	/**
	 * Create an express GET one route for the default getOneRoutePath and getOneMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */		
	createGetOneRoute(options){
		this._buildRoute("get", this.getOneRoutePath, this.getOneMiddleware, options);
	}	
	
 	/**
	 * Create an express GET many route for the default getManyRoutePath and getManyMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */		
	createGetManyRoute(options){
		this._buildRoute("get", this.getManyRoutePath, this.getManyMiddleware, options);
	}	
	
 	/**
	 * Create an express POST route for the default postRoutePath and postRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */		
	createPostRoute(options){
		this._buildRoute("post", this.postRoutePath, this.postRouteMiddleware, options);
	}	
	
 	/**
	 * Create an express PUT route for the default putRoutePath and putRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */		
	createPutRoute(options){
		this._buildRoute("put", this.putRoutePath, this.putRouteMiddleware, options );
	}
	
 	/**
	 * Create an express DELETE route for the default deleteRoutePath and deleteRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */		
	createDeleteRoute(options){
		this._buildRoute("delete", this.deleteRoutePath, this.deleteRouteMiddleware, options );
	}	
	
	_createDefaultOption(options, defaults){
		options = options || {};
		_.defaults(options,defaults);
		return options;
	}
	
	_buildRoute(httpMethod, routePath, routeMiddleware, options){
		const resolvedOptions = this._createDefaultOption(options, {authenticate:true});
		if(resolvedOptions.authenticate){
			this.router[httpMethod](routePath, isAuthenticated, routeMiddleware);
		} else {
			this.router[httpMethod](routePath, routeMiddleware);
		}
	}

}

module.exports = RouteBase;
