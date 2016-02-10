/**
 * Database configuration module. Set connection strings to mongodb
 * for development, test, and production environments
 * @module config/dbconf
 */
"use strict";

const config = {
	mongo: {
	    development:"mongodb://localhost:27017/mongo-website",
	    test:"mongodb://localhost:27017/mongo-website-test",
	}
};

module.exports = config;