/**
 * ModelControllerBase module.
 * @module routes/model-controller-base
 */
"use strict";

const _ = require('lodash');
import {Model} from 'mongoose';
import {ModelUtils} from '../../utils/model-utils';
import {ControllerBase} from './controller-base';

/**
 * ModelControllerBase is a base class for controllers that are REST services over a mongoose data model.
 */
export class ModelControllerBase extends ControllerBase{

    public Model: Model<any>;
    public modelUtils: ModelUtils;

	/**
	 * @param {object} app This is the express application object
	 * @param {object} Model The mongoose model that the controller will use.
	 * @param {object} ErrorLog The mongoose model that is used for logging.
	 */
	constructor(app, Model, ErrorLog){
	    super(app, ErrorLog);

		this.Model = Model;
		this.modelUtils = new ModelUtils(Model);
	}

 	/**
	 * Express middleware for a GET route that will return a single model
	 * @returns {function} an express middleware function
	 */
	get getOneMiddleware(){
		const responsePath = this.modelUtils.dashSingularName;
		return (req, res, next) => {
			const modelId = req.params.id;
			(this.Model.findOne({_id:modelId})
				.exec()
				.then(model => {
					if(!model){
						return res.status(404).send(`could not find one for id ${modelId}`);
					}
					const result = {
						[responsePath]: model
					};
				  	req.modelResult = result;
				  	next();
				}) as any)
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
			(this.Model.find({})
				.exec()
				.then(model => {
					const result = {
						[responsePath]: model
					};
				  	req.modelResult = result;
				  	next();
				}) as any)
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
				  	req.modelResult = result;
				  	next();
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
			(<any>this.Model).findOneAndUpdate({_id: modelId}, {$set: body}, {new:true,  runValidators: true})
				.exec()
				.then(savedModel => {
					if(!savedModel){
						return res.status(404).send(`${this.Model.modelName} ${body._id} not found`);
					}
					const result = {
						[responsePath]: savedModel
					};
				  	req.modelResult = result;
				  	next();
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
			(this.Model.remove({_id: modelId}) as any)
				.then(deleteModel => {
					if(!deleteModel){
						return res.status(404).send(`${this.Model.modelName} ${body._id} not found`);
					}
				  	next();
				})
				.catch(err => {
					return this.sendErrorResponse(res, err);
				});
		};
	}

	get resultMiddleware(){
		return function(req, res){
			res.json(req.modelResult);
		};
	}

	get deleteResultMiddleware(){
		return function(req, res){
			res.sendStatus(204);
		};
	}

 	/**
	 * Create an express GET one route for the default getOneRoutePath and getOneMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */
	createGetOneRoute(options){
		this._buildRoute("get", this.getOneRoutePath, [this.getOneMiddleware, this.resultMiddleware], options);
	}

 	/**
	 * Create an express GET many route for the default getManyRoutePath and getManyMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */
	createGetManyRoute(options){
		this._buildRoute("get", this.getManyRoutePath, [this.getManyMiddleware, this.resultMiddleware], options);
	}

 	/**
	 * Create an express POST route for the default postRoutePath and postRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */
	createPostRoute(options){
		this._buildRoute("post", this.postRoutePath, [this.postRouteMiddleware, this.resultMiddleware], options);
	}

 	/**
	 * Create an express PUT route for the default putRoutePath and putRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */
	createPutRoute(options){
		this._buildRoute("put", this.putRoutePath, [this.putRouteMiddleware, this.resultMiddleware], options );
	}

 	/**
	 * Create an express DELETE route for the default deleteRoutePath and deleteRouteMiddleware
	 * @params {object} has an authenticate option to make the route require authentication
	 */
	createDeleteRoute(options){
		this._buildRoute("delete", this.deleteRoutePath, [this.deleteRouteMiddleware, this.deleteResultMiddleware], options );
	}

}

