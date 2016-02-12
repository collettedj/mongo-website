/**
 * ControllerBase module.
 * @module routes/controller-base
 */
"use strict";

const _ = require('lodash');
const express = require('express');
const isAuthenticated = require('../auth').isAuthenticated;
const isClientAuthenticated = require('../auth').isClientAuthenticated;
const isBearerAuthenticated = require('../auth').isBearerAuthenticated;

/**
 * ControllerBase is a base class for controllers that are REST services over a mongoose data model.
 */
class ControllerBase{
	
	/**
	 * @param {object} app This is the express application object
	 * @param {object} Model The mongoose model that the controller will use.
	 * @param {object} ErrorLog The mongoose model that is used for logging.
	 */
	constructor(app, ErrorLog){
		this.app = app;
		this.router = express.Router(); 
		this.ErrorLog = ErrorLog;
		this.isAuthenticated = isAuthenticated;
		this.isClientAuthenticated = isClientAuthenticated;
		this.isBearerAuthenticated = isBearerAuthenticated;
	}
	
	applyControllerToRouter(){
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
				res.status(500).send(err);		
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

module.exports = ControllerBase;
