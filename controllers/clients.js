/**
 * Client module.
 * @module routes/Clients
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
 * ClientController is a class that creates an express route with GET,POST,PUT,and DELETE.
 */
var ClientController = (function (_super) {
    __extends(ClientController, _super);
    /**
     * @param  {object} app express Client object
     */
    function ClientController(app) {
        _super.call(this, app, models.Client, models.ErrorLog);
    }
    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    ClientController.prototype.createRoutes = function () {
        _super.prototype.createGetOneRoute.call(this, {});
        _super.prototype.createGetManyRoute.call(this, {});
        // super.createPostRoute();
        _super.prototype.createPutRoute.call(this, {});
        _super.prototype.createDeleteRoute.call(this, {});
        this.router.post(this.postRoutePath, this.isAuthenticated, this.setUserIdMiddleware, this.postRouteMiddleware, this.resultMiddleware);
    };
    Object.defineProperty(ClientController.prototype, "setUserIdMiddleware", {
        /**
         * set the user id on the body so that it will be set when the model get inserted into the database
         *
         */
        get: function () {
            var responsePath = this.modelUtils.dashSingularName;
            var bodyPath = responsePath;
            return function (req, res, next) {
                req.body[bodyPath].userId = req.user._id;
                next();
            };
        },
        enumerable: true,
        configurable: true
    });
    return ClientController;
}(model_controller_base_1.ModelControllerBase));
exports.ClientController = ClientController;
//# sourceMappingURL=clients.js.map