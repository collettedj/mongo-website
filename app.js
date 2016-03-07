/**
 * app module. The express application
 * @module app
 */
'use strict';
var express = require('express');
var path = require('path');
// import * as favicon from 'serve-favicon';
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var models = require('./models');
var controllers_1 = require('./controllers');
models.initModels();
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') !== 'test') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Use express session support since OAuth2orize requires it
app.use(session({
    secret: 'mongo_site_secret_key',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
controllers_1.loadRoutes('/api/v1/', app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
            .send({
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if (app.get('env') !== 'test') {
        console.log(err.stack);
    }
    res.status(err.status || 500)
        .send({
        message: err.message,
        error: {}
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map