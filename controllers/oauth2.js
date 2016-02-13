"use strict";

// Load required packages
var oauth2orize = require('oauth2orize')
var oauth2orize_ext = require('oauth2orize-openid') // require extentions.
var Client = require('../models').Client;
var Token = require('../models').Token;
var Code = require('../models').Code;
var ErrorLog = require('../models').ErrorLog;

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});

// id_token grant type.
server.grant(oauth2orize_ext.grant.idToken(function(client, user, done){
  var id_token;
  // Do your lookup/token generation.
  // ... id_token =
  console.log("idToken");
  done(null, id_token);
}));

// 'id_token token' grant type.
server.grant(oauth2orize_ext.grant.idTokenToken(
  function(client, user, done){
    var token;
    // Do your lookup/token generation.
    // ... token =
    console.log("idTokenToken")
    done(null, token);
  },
  function(client, user, done){
    var id_token;
    // Do your lookup/token generation.
    // ... id_token =
    done(null, id_token);
  }
));

// Hybrid Flow

// 'code id_token' grant type.
server.grant(oauth2orize_ext.grant.codeIdToken(
  function(client, redirect_uri, user, done){
    var code;
    // Do your lookup/token generation.
    // ... code =
    console.log("codeIdToken")
    done(null, code);
  },
  function(client, user, done){
    var id_token;
    // Do your lookup/token generation.
    // ... id_token =
    done(null, id_token);
  }
));

// 'code token' grant type.
server.grant(oauth2orize_ext.grant.codeToken(
  function(client, user, done){
    var token;
    // Do your lookup/token generation.
    // ... id_token =
    console.log('code token 1')
    done(null, token);
  },
  function(client, redirect_uri, user, done){
    var code;
    // Do your lookup/token generation.
    // ... code =
    console.log('code token 2');
    done(null, code);
  }
));

// 'code id_token token' grant type.
server.grant(oauth2orize_ext.grant.codeIdTokenToken(
 function(client, user, done){
    var token;
    // Do your lookup/token generation.
    // ... id_token =
    console.log("codeIdTokenToken 1");
    done(null, token);
  },
  function(client, redirect_uri, user, done){
    var code;
    // Do your lookup/token generation.
    // ... code =
    console.log("codeIdTokenToken 2");
    done(null, code);
  },
  function(client, user, done){
    var id_token;
    // Do your lookup/token generation.
    // ... id_token =
    console.log("codeIdTokenToken 3");
    done(null, id_token);
  }
));

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the auth code and check for errors
  code.save(function(err) {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
  Code.findOne({ value: code }, function (err, authCode) {
    if (err) { return callback(err); }
    if (authCode === undefined  || authCode === null) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); } 

    // Delete auth code now that it has been used
    authCode.remove(function (err) {
      if(err) { return callback(err); }

      // Create a new access token
      var token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      });

      // Save the access token and check for errors
      token.save(function (err) {
        if (err) { return callback(err); }

        callback(null, token);
      });
    });
  });
}));

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `callback` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view. 

const middleware = {};

middleware.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {
    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { return callback(err); }
      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

middleware.decision = [
  server.decision()
]

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

middleware.token = [
  server.token(),
  server.errorHandler()
];

const ControllerBase = require('./base/controller-base');
class UserController extends ControllerBase {

	/**
	 * @param  {object} app express application object
	 */
	constructor(app){ 
		super(app, ErrorLog);
	}

	/**
	 * the creatRoutes function creates all of the routes for the class
	 * @return {Void}
	 */
	createRoutes(){
        // Create endpoint handlers for oauth2 authorize
        this.router.get('/authorize',this.isAuthenticated, middleware.authorization);
        this.router.post('/authorize',this.isAuthenticated, middleware.decision);
        
        // Create endpoint handlers for oauth2 token
        this.router.post('/token', this.isClientAuthenticated, middleware.token);

	}

}

module.exports = UserController;

