'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const debug = require('debug');
const serverError = debug('cfdemo:servererror');

const authorizationRouter = require('./route/authorizationRouter');
const authenticationRouter = require('./route/authenticationRouter');
const tf2Router = require('./route/tf2Router');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/auth_dev');
process.env.APP_SECRET = 'secret';

app.use('/api/authorization', authorizationRouter);
app.use('/api/authentication', authenticationRouter);
app.use('/api', tf2Router);

app.use((err, req, res, data) => {
  serverError(err);
  res.status(err.statusCode).json(err.message);
});

app.listen(process.env.PORT || 3000, () => console.log('Server up!'));
