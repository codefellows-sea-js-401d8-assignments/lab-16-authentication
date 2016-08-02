'use strict';
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const morgan = require('morgan');
const httpError = require('http-errors');
const errorHandler = require('./lib/error_handler');

const authRouter = require('./route/auth_router');

const PORT = process.env.PORT || process.argv[2] || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/auth_dev';

const server = express();

mongoose.connect(MONGO_URI);

server.use(morgan('dev'));

server.use('/api', authRouter);

server.all('*', (req, res, next) => {
  next(httpError(404, 'route not registered'));
});

server.use(errorHandler);

module.exports = server.listen(PORT, () => {
  console.log(`server up on port ${PORT}`);
});
