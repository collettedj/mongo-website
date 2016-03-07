/**
 * route index module. load all routes defined in the routes folder.
 * @module routes/index
 */
"use strict";
var authenticate_1 = require('./authenticate');
var clients_1 = require('./clients');
var oauth2_1 = require('./oauth2');
var users_1 = require('./users');
function loadRoutes(baseRoutePath, app) {
    var controllers = [
        {
            controller: new authenticate_1.AuthenticateController(app),
            path: "authenticate"
        },
        {
            controller: new clients_1.ClientController(app),
            path: "clients"
        },
        {
            controller: new oauth2_1.Oauth2Controller(app),
            path: "oauth2"
        },
        {
            controller: new users_1.UserController(app),
            path: "users"
        }];
    controllers.forEach(function (c) {
        c.controller.applyControllerToRouter();
        app.use(baseRoutePath + c.path, c.controller.router);
    });
}
exports.loadRoutes = loadRoutes;
//# sourceMappingURL=index.js.map