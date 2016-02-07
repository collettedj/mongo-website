"use strict";

const mongoose = require('mongoose');
const dbconf = require('./dbconf');

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log();
});

