'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
const debug = require('debug');
const serverError = debug('cfdemo:servererror');

const authorizationRouter = require('./route/authorizationRouter');
const authenticationRouter = require('./route/authenticationRouter');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/auth_dev');

app.use('/api', authorizationRouter);
app.use('/api/signup', authenticationRouter);

app.use((err, req, res, data) => {
  serverError(err);
  res.status(err.statusCode).json(err.message);
});

app.listen(process.env.PORT || 3000, () => console.log('Server up on 3000'));
