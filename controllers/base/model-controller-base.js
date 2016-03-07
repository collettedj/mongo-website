/**
 * ModelControllerBase module.
 * @module routes/model-controller-base
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var model_utils_1 = require('../../utils/model-utils');
var controller_base_1 = require('./controller-base');
/**
 * ModelControllerBase is a base class for controllers that are REST services over a mongoose data model.
 */
var ModelControllerBase = (function (_super) {
    __extends(ModelControllerBase, _super);
    /**
     * @param {object} app This is the express application object
     * @param {object} Model The mongoose model that the controller will use.
     * @param {object} ErrorLog The mongoose model that is used for logging.
     */
    function ModelControllerBase(app, Model, ErrorLog) {
        _super.call(this, app, ErrorLog);
        this.Model = Model;
        this.modelUtils = new model_utils_1.ModelUtils(Model);
    }
    Object.defineProperty(ModelControllerBase.prototype, "getOneMiddleware", {
        /**
         * Express middleware for a GET route that will return a single model
         * @returns {function} an express middleware function
         */
        get: function () {
            var _this = this;
            var responsePath = this.modelUtils.dashSingularName;
            return function (req, res, next) {
                var modelId = req.params.id;
                _this.Model.findOne({ _id: modelId })
                    .exec()
                    .then(function (model) {
                    if (!model) {
                        return res.status(404).send("could not find one for id " + modelId);
                    }
                    var result = (_a = {},
                        _a[responsePath] = model,
                        _a
                    );
                    req.modelResult = result;
                    next();
                    var _a;
                })
                    .catch(function (err) {
                    return _this.sendErrorResponse(res, err);
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelControllerBase.prototype, "getManyMiddleware", {
        /**
         * Express middleware for a GET route that will return multiple models
         * @returns {function} an express middleware function
         */
        get: function () {
            var _this = this;
            var responsePath = this.modelUtils.dashPluralName;
            return function (req, res, next) {
                _this.Model.find({})
                    .exec()
                    .then(function (model) {
                    var result = (_a = {},
                        _a[responsePath] = model,
                        _a
                    );
                    req.modelResult = result;
                    next();
                    var _a;
                })
                    .catch(function (err) {
                    return _this.sendErrorResponse(res, err);
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelControllerBase.prototype, "postRouteMiddleware", {
        /**
         * Express middleware for a POST route that will insert a mongoose object
         * @returns {function} an express middleware function
         */
        get: function () {
            var _this = this;
            var responsePath = this.modelUtils.dashSingularName;
            var bodyPath = responsePath;
            return function (req, res, next) {
                var body = req.body[bodyPath];
                var model = new _this.Model(body);
                model.save()
                    .then(function (savedModel) {
                    var result = (_a = {},
                        _a[responsePath] = savedModel,
                        _a
                    );
                    req.modelResult = result;
                    next();
                    var _a;
                })
                    .catch(function (err) {
                    return _this.sendErrorResponse(res, err);
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelControllerBase.prototype, "putRouteMiddleware", {
        /**
         * Express middleware for a PUT route that will update a mongoose object
         * @returns {function} an express middleware function
         */
        get: function () {
            var _this = this;
            var responsePath = this.modelUtils.dashSingularName;
            var bodyPath = responsePath;
            return function (req, res, next) {
                var modelId = req.params.id;
                var body = req.body[bodyPath];
                _this.Model.findOneAndUpdate({ _id: modelId }, { $set: body }, { new: true, runValidators: true })
                    .exec()
                    .then(function (savedModel) {
                    if (!savedModel) {
                        return res.status(404).send(_this.Model.modelName + " " + body._id + " not found");
                    }
                    var result = (_a = {},
                        _a[responsePath] = savedModel,
                        _a
                    );
                    req.modelResult = result;
                    next();
                    var _a;
                })
                    .catch(function (err) {
                    return _this.sendErrorResponse(res, err);
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelControllerBase.prototype, "deleteRouteMiddleware", {
        /**
         * Express middleware for a DELETE route that will delete a mongoose object
         * @returns {function} an express middleware function
         */
        get: function () {
            var _this = this;
            var responsePath = this.modelUtils.dashSingularName;
            var bodyPath = responsePath;
            return function (req, res, next) {
                var modelId = req.params.id;
                var body = req.body[bodyPath];
                _this.Model.remove({ _id: modelId })
                    .then(function (deleteModel) {
                    if (!deleteModel) {
                        return res.status(404).send(_this.Model.modelName + " " + body._id + " not found");
                    }
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
    Object.defineProperty(ModelControllerBase.prototype, "resultMiddleware", {
        get: function () {
            return function (req, res) {
                res.json(req.modelResult);
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelControllerBase.prototype, "deleteResultMiddleware", {
        get: function () {
            return function (req, res) {
                res.sendStatus(204);
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create an express GET one route for the default getOneRoutePath and getOneMiddleware
     * @params {object} has an authenticate option to make the route require authentication
     */
    ModelControllerBase.prototype.createGetOneRoute = function (options) {
        this._buildRoute("get", this.getOneRoutePath, [this.getOneMiddleware, this.resultMiddleware], options);
    };
    /**
     * Create an express GET many route for the default getManyRoutePath and getManyMiddleware
     * @params {object} has an authenticate option to make the route require authentication
     */
    ModelControllerBase.prototype.createGetManyRoute = function (options) {
        this._buildRoute("get", this.getManyRoutePath, [this.getManyMiddleware, this.resultMiddleware], options);
    };
    /**
     * Create an express POST route for the default postRoutePath and postRouteMiddleware
     * @params {object} has an authenticate option to make the route require authentication
     */
    ModelControllerBase.prototype.createPostRoute = function (options) {
        this._buildRoute("post", this.postRoutePath, [this.postRouteMiddleware, this.resultMiddleware], options);
    };
    /**
     * Create an express PUT route for the default putRoutePath and putRouteMiddleware
     * @params {object} has an authenticate option to make the route require authentication
     */
    ModelControllerBase.prototype.createPutRoute = function (options) {
        this._buildRoute("put", this.putRoutePath, [this.putRouteMiddleware, this.resultMiddleware], options);
    };
    /**
     * Create an express DELETE route for the default deleteRoutePath and deleteRouteMiddleware
     * @params {object} has an authenticate option to make the route require authentication
     */
    ModelControllerBase.prototype.createDeleteRoute = function (options) {
        this._buildRoute("delete", this.deleteRoutePath, [this.deleteRouteMiddleware, this.deleteResultMiddleware], options);
    };
    return ModelControllerBase;
}(controller_base_1.ControllerBase));
exports.ModelControllerBase = ModelControllerBase;
//# sourceMappingURL=model-controller-base.js.map