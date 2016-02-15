"use strict";

var passport = require('passport');
const ControllerBase = require('./base/controller-base');
const models = require('../models');

class AuthenticateController extends ControllerBase {

    /**
     * @param  {object} app express application object
     */
    constructor(app){
        super(app, models.ErrorLog);
    }

    /**
     * the creatRoutes function creates all of the routes for the class
     * @return {Void}
     */
    createRoutes(){
        // Create endpoint handlers for oauth2 authorize
        this.router.post('/login', function(req, res, next) {
              passport.authenticate('basic', function(err, user, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        res.status(401).send(info);
                    }else{
                        req.logIn(user, function(err) {
                            if (err) { return next(err); }
                            return res.send(user);
                        });
                    }
              })(req, res, next);
        });

        this.router.get('/user', function(req, res) {
            console.log("**********************************");
            console.log(req.user);
            res.status(200).json(req.user);
        });

        /* Handle Registration POST */
        this.router.post('/signup',
            passport.authenticate('signup'),
            function(req, res){
                res.status(200).json(req.user);
            }
        );

        /* Handle Logout */
        this.router.get('/signout', function(req, res) {
          req.logout();
          res.sendStatus(200);
        });

    }

}

module.exports = AuthenticateController;