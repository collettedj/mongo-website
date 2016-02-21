/**
 * Database configuration module. Set connection strings to mongodb
 * for development, test, and production environments
 * @module config/dbconf
 */
"use strict";

const config = {
	mongo: {
        production: process.env.MONGO_CONNECTION_PRODUCTION,
	    development: process.env.MONGO_CONNECTION_DEVELOPMENT,
	    test: process.env.MONGO_CONNECTION_TEST,
	}
};

module.exports = config;