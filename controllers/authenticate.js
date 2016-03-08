"use strict";
var passport = require('passport');
const controller_base_1 = require('./base/controller-base');
const models = require('../models');
class AuthenticateController extends controller_base_1.ControllerBase {
    /**
     * @param  {object} app express application object
     */
    constructor(app) {
        super(app, models.ErrorLog);
    }
    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    createRoutes() {
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
    }
    authenticateLoginMiddleware(strategyName) {
        return (req, res, next) => {
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
    }
}
exports.AuthenticateController = AuthenticateController;
//# sourceMappingURL=authenticate.js.map