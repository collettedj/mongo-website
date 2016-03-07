"use strict";

const oauth2mid = require('./base/oauth2-middleware');
// const ControllerBase = require('./base/controller-base');
import {ControllerBase} from './base/controller-base';
import {ErrorLog} from '../models';

export class Oauth2Controller extends ControllerBase {

	/**
	 * @param  {object} app express application object
	 */
	constructor(app){
		super(app, ErrorLog);
	}

	/**
	 * the creatRoutes function creates all of the routes for the class
	 * @return {Void}
	 */
	createRoutes(){
        // Create endpoint handlers for oauth2 authorize
        this.router.get('/authorize',this.isAuthenticated, oauth2mid.authorization);
        this.router.post('/authorize',this.isAuthenticated, oauth2mid.decision);

        // Create endpoint handlers for oauth2 token
        this.router.post('/token', this.isClientAuthenticated, oauth2mid.token);

	}

}

