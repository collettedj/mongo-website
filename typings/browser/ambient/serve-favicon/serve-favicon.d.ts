// Compiled using typings@0.6.10
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/aa6a9fa49d4b1de8defe4d6db05103dadae81ad6/serve-favicon/serve-favicon.d.ts
// Type definitions for serve-favicon 2.2.0
// Project: https://github.com/expressjs/serve-favicon
// Definitions by: Uros Smolnik <https://github.com/urossmolnik/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/* =================== USAGE ===================

    import serveFavicon = require('serve-favicon');
    app.use(serveFavicon(__dirname + '/public/favicon.ico'));

 =============================================== */


declare module "serve-favicon" {
    import express = require('express');

    /**
     * Node.js middleware for serving a favicon.
     */
    function serveFavicon(path: string, options?: {
        /**
        * The cache-control max-age directive in ms, defaulting to 1 day. This can also be a string accepted by the ms module.
        */
        maxAge?: number;
    }): express.RequestHandler;
    
    namespace serveFavicon{}

    export = serveFavicon;
}