/**
 * route index module. load all routes defined in the routes folder.
 * @module routes/index
 */
"use strict";
const authenticate_1 = require('./authenticate');
const clients_1 = require('./clients');
const oauth2_1 = require('./oauth2');
const users_1 = require('./users');
function loadRoutes(baseRoutePath, app) {
    const controllers = [
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
    controllers.forEach(c => {
        c.controller.applyControllerToRouter();
        app.use(baseRoutePath + c.path, c.controller.router);
    });
}
exports.loadRoutes = loadRoutes;
//# sourceMappingURL=index.js.map