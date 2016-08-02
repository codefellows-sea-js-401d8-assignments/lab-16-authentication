'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const debug = require('debug')('movie:server');
const morgan = require('morgan');
const errorResponse = require('./lib/error-response');
const hitRouter = require('./route/hit-route');
const hitlistRouter = require('./route/hitlist-route');
const AppError = require('./lib/AppError');

const PORT = process.argv[2] || process.env.PORT || 3000;
const LOCAL_DB_SERVER = 'mongodb://localhost/hitlist_db';
const DB_SERVER = process.env.DB_SERVER || LOCAL_DB_SERVER;

const server = express();

mongoose.connect(DB_SERVER);

server.use(morgan('dev'));
server.use(errorResponse());
server.use('/api/hit', hitRouter);
server.use('/api/hitlist', hitlistRouter);


server.all('*', (req, res) => {
  debug('*:404');
  return res.sendError(AppError.error404('path not supported'));
});

module.exports = server.listen(PORT, () => {
  console.log(`server up on port ${PORT}`);
});
