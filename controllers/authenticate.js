"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport = require('passport');
var controller_base_1 = require('./base/controller-base');
var models = require('../models');
var AuthenticateController = (function (_super) {
    __extends(AuthenticateController, _super);
    /**
     * @param  {object} app express application object
     */
    function AuthenticateController(app) {
        _super.call(this, app, models.ErrorLog);
    }
    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    AuthenticateController.prototype.createRoutes = function () {
        // Create endpoint handlers for oauth2 authorize
        this.router.post('/login', this.authenticateLoginMiddleware("login"));
        /* Handle Registration POST */
        this.router.post('/signup', this.authenticateLoginMiddleware("signup"));
        this.router.get('/user', function (req, res) {
            res.status(200).json(req.user);
        });
        /* Handle Logout */
        this.router.get('/signout', function (req, res) {
            req.logout();
            res.sendStatus(200);
        });
    };
    AuthenticateController.prototype.authenticateLoginMiddleware = function (strategyName) {
        return function (req, res, next) {
            passport.authenticate(strategyName, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    res.status(401).send(info);
                }
                else {
                    req.logIn(user, function (err) {
                        // console.log(user);
                        if (err) {
                            console.log(err);
                            return next(err);
                        }
                        return res.send(user);
                    });
                }
            })(req, res, next);
        };
    };
    return AuthenticateController;
}(controller_base_1.ControllerBase));
exports.AuthenticateController = AuthenticateController;
//# sourceMappingURL=authenticate.js.map