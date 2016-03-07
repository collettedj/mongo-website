/**
 * ControllerBase module.
 * @module routes/controller-base
 */
"use strict";
var _ = require('lodash');
var express = require('express');
var auth_1 = require('./auth');
/**
 * ControllerBase is a base class for controllers that are REST services over a mongoose data model.
 */
var ControllerBase = (function () {
    /**
     * @param {object} app This is the express application object
     * @param {object} Model The mongoose model that the controller will use.
     * @param {object} ErrorLog The mongoose model that is used for logging.
     */
    function ControllerBase(app, ErrorLog) {
        this.app = app;
        this.ErrorLog = ErrorLog;
        this.router = express.Router();
        this.isAuthenticated = auth_1.isAuthenticated;
        this.isClientAuthenticated = auth_1.isClientAuthenticated;
        this.isBearerAuthenticated = auth_1.isBearerAuthenticated;
    }
    ControllerBase.prototype.createRoutes = function () {
    };
    ControllerBase.prototype.applyControllerToRouter = function () {
        if (this.createRoutes) {
            this.createRoutes();
        }
        else {
            throw new Error("you must define the createRoutes method");
        }
    };
    /**
     * Send a 500 response for unexptected errors. It will also log the error to the ErrorLog model that was passed in to the constructor
     * @param {object} res express response object
     * @param {object} error
     */
    ControllerBase.prototype.sendErrorResponse = function (res, err) {
        var errorLog = new this.ErrorLog({
            message: err.stack,
            createdAt: new Date(),
        });
        console.log("error response", err.stack);
        return errorLog.save()
            .catch(function (err) {
            console.log("failed to save error to log", err.stack);
        })
            .then(function () {
            var result = {
                errors: err
            };
            if (result.errors.errors) {
                result.errors = result.errors.errors;
            }
            res.status(500).send(result);
        });
    };
    Object.defineProperty(ControllerBase.prototype, "getOneRoutePath", {
        /**
         * The default path for a GET route that will get one result
         * @returns {string}
         */
        get: function () {
            return '/:id';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "getManyRoutePath", {
        /**
         * The default path for a GET route that will get multiple result
         * @returns {string}
         */
        get: function () {
            return '/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "postRoutePath", {
        /**
         * The default path for a POST route
         * @returns {string}
         */
        get: function () {
            return '/';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "putRoutePath", {
        /**
         * The default path for a PUT route
         * @returns {string}
         */
        get: function () {
            return '/:id';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerBase.prototype, "deleteRoutePath", {
        /**
         * The default path for a DELETE route
         * @returns {string}
         */
        get: function () {
            return '/:id';
        },
        enumerable: true,
        configurable: true
    });
    ControllerBase.prototype._createDefaultOption = function (options, defaults) {
        options = options || {};
        _.defaults(options, defaults);
        return options;
    };
    ControllerBase.prototype._buildRoute = function (httpMethod, routePath, routeMiddleware, options) {
        var resolvedOptions = this._createDefaultOption(options, { authenticate: true });
        if (resolvedOptions.authenticate) {
            this.router[httpMethod](routePath, auth_1.isAuthenticated, routeMiddleware);
        }
        else {
            this.router[httpMethod](routePath, routeMiddleware);
        }
    };
    return ControllerBase;
}());
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controller-base.js.map