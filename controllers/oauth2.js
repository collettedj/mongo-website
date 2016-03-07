"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var oauth2mid = require('./base/oauth2-middleware');
// const ControllerBase = require('./base/controller-base');
var controller_base_1 = require('./base/controller-base');
var models_1 = require('../models');
var Oauth2Controller = (function (_super) {
    __extends(Oauth2Controller, _super);
    /**
     * @param  {object} app express application object
     */
    function Oauth2Controller(app) {
        _super.call(this, app, models_1.ErrorLog);
    }
    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    Oauth2Controller.prototype.createRoutes = function () {
        // Create endpoint handlers for oauth2 authorize
        this.router.get('/authorize', this.isAuthenticated, oauth2mid.authorization);
        this.router.post('/authorize', this.isAuthenticated, oauth2mid.decision);
        // Create endpoint handlers for oauth2 token
        this.router.post('/token', this.isClientAuthenticated, oauth2mid.token);
    };
    return Oauth2Controller;
}(controller_base_1.ControllerBase));
exports.Oauth2Controller = Oauth2Controller;
//# sourceMappingURL=oauth2.js.map