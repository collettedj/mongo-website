/**
 * users module.
 * @module routes/users
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// const ModelControllerBase = require('./base/model-controller-base');
var model_controller_base_1 = require('./base/model-controller-base');
var models = require('../models');
/**
 * UserController is a class that creates an express router with GET,POST,PUT,and DELETE.
 */
var UserController = (function (_super) {
    __extends(UserController, _super);
    /**
     * @param  {object} app express application object
     */
    function UserController(app) {
        _super.call(this, app, models.User, models.ErrorLog);
    }
    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    UserController.prototype.createRoutes = function () {
        // super.createGetOneRoute();
        _super.prototype.createGetManyRoute.call(this, {});
        // super.createPostRoute({authenticate:false});
        // super.createPutRoute();
        // super.createDeleteRoute();
        this.router.get(this.getOneRoutePath, this.isAuthenticated, this.getOneMiddleware, this.includeModelsForGetOne, this.resultMiddleware);
        this.router.put(this.putRoutePath, this.isAuthenticated, this.isSelf, this.putRouteMiddleware, this.resultMiddleware);
        this.router.delete(this.deleteRoutePath, this.isAuthenticated, this.isSelf, this.deleteRouteMiddleware, this.deleteResultMiddleware);
    };
    Object.defineProperty(UserController.prototype, "isSelf", {
        /**
         * middleware to ensure that the sessions user is the same as the user being modified
         * @param  {object} express request object
         * @param  {object} express response object
         * @param  {Function} callback
         * @return {Void}
         */
        get: function () {
            return function (req, res, next) {
                var userId = req.user._id.toString();
                var requestId = req.params.id;
                if (requestId !== userId) {
                    return res.status(401).send("user " + userId + " cannot modify user " + requestId);
                }
                else {
                    next(null);
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserController.prototype, "includeModelsForGetOne", {
        get: function () {
            var _this = this;
            return function (req, res, next) {
                var requestId = req.params.id;
                models.Client.find({ "userId": requestId })
                    .then(function (clients) {
                    req.modelResult.clients = clients;
                    next();
                })
                    .catch(function (err) {
                    return _this.sendErrorResponse(res, err);
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    return UserController;
}(model_controller_base_1.ModelControllerBase));
exports.UserController = UserController;
//# sourceMappingURL=users.js.map