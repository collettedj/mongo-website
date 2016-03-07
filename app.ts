/**
 * app module. The express application
 * @module app
 */
'use strict';

import * as express from 'express';
import * as path from 'path';
// import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as models from './models';
import {loadRoutes} from './controllers';

models.initModels();

const app = express();

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

loadRoutes('/api/v1/', app);

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
  var err = new Error('Not Found');
  (<any>err).status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500)
    .send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err:any, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (app.get('env') !== 'test') {
    console.log(err.stack);
  }
  res.status(err.status || 500)
  .send({
    message: err.message,
    error: {}
  });
});


export = app;
