/**
 * route index module. load all routes defined in the routes folder.
 * @module routes/index
 */
"use strict";

import {ControllerBase} from './base/controller-base';

interface ControllerInfo{
    controller: ControllerBase,
	path:string
}

import {AuthenticateController} from './authenticate';
import {ClientController} from './clients';
import {Oauth2Controller} from './oauth2';
import {UserController} from './users';

export function loadRoutes(baseRoutePath, app) {
    const controllers:[ControllerInfo] = [
        {
            controller: new AuthenticateController(app),
            path: "authenticate"
        },
        {
            controller: new ClientController(app),
            path: "clients"
        },
        {
            controller: new Oauth2Controller(app),
            path: "oauth2"
        },
        {
            controller: new UserController(app),
            path: "users"
        }];
    controllers.forEach(c => {
        c.controller.applyControllerToRouter();
        app.use(baseRoutePath + c.path, c.controller.router);
    });
}