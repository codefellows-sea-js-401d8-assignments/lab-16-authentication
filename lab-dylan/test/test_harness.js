'use strict';

process.env.APP_SECRET = 'test secret';
require('./test_server');
require('./auth-test');

const mongoose = require('mongoose');
const Promise = require('../lib/promise');
mongoose.Promise = Promise;

process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('database dropped ' + code));
});
