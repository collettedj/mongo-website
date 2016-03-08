/**
 * ControllerBase module.
 * @module routes/controller-base
 */
"use strict";
const _ = require('lodash');
const express = require('express');
const auth_1 = require('./auth');
/**
 * ControllerBase is a base class for controllers that are REST services over a mongoose data model.
 */
class ControllerBase {
    /**
     * @param {object} app This is the express application object
     * @param {object} Model The mongoose model that the controller will use.
     * @param {object} ErrorLog The mongoose model that is used for logging.
     */
    constructor(app, ErrorLog) {
        this.app = app;
        this.ErrorLog = ErrorLog;
        this.router = express.Router();
        this.isAuthenticated = auth_1.isAuthenticated;
        this.isClientAuthenticated = auth_1.isClientAuthenticated;
        this.isBearerAuthenticated = auth_1.isBearerAuthenticated;
    }
    createRoutes() {
    }
    applyControllerToRouter() {
        if (this.createRoutes) {
            this.createRoutes();
        }
        else {
            throw new Error("you must define the createRoutes method");
        }
    }
    /**
     * Send a 500 response for unexptected errors. It will also log the error to the ErrorLog model that was passed in to the constructor
     * @param {object} res express response object
     * @param {object} error
     */
    sendErrorResponse(res, err) {
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
            const result = {
                errors: err
            };
            if (result.errors.errors) {
                result.errors = result.errors.errors;
            }
            res.status(500).send(result);
        });
    }
    /**
     * The default path for a GET route that will get one result
     * @returns {string}
     */
    get getOneRoutePath() {
        return '/:id';
    }
    /**
     * The default path for a GET route that will get multiple result
     * @returns {string}
     */
    get getManyRoutePath() {
        return '/';
    }
    /**
     * The default path for a POST route
     * @returns {string}
     */
    get postRoutePath() {
        return '/';
    }
    /**
     * The default path for a PUT route
     * @returns {string}
     */
    get putRoutePath() {
        return '/:id';
    }
    /**
     * The default path for a DELETE route
     * @returns {string}
     */
    get deleteRoutePath() {
        return '/:id';
    }
    _createDefaultOption(options, defaults) {
        options = options || {};
        _.defaults(options, defaults);
        return options;
    }
    _buildRoute(httpMethod, routePath, routeMiddleware, options) {
        const resolvedOptions = this._createDefaultOption(options, { authenticate: true });
        if (resolvedOptions.authenticate) {
            this.router[httpMethod](routePath, auth_1.isAuthenticated, routeMiddleware);
        }
        else {
            this.router[httpMethod](routePath, routeMiddleware);
        }
    }
}
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controller-base.js.map