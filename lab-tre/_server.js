'use strict';

let port = 5000;

if(!process.env.APP_SECRET) throw new Error('Please set the env APP_SECRET');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth_dev');
let app = require('express')();

let authRouter = require('./route/router');
let serverError = require('debug')('cfdemo:error');

app.use('api', authRouter);

app.use((err, req, res, next) => { //eslint-disable-line no-unused-vars
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
});
app.listen(port, () => console.log('server up'));
