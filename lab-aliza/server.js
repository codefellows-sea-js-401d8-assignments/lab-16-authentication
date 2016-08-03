'use strict';

const port = 3000;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const morgan = require('morgan');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/auth_dev';
let app = require('express')();
let authRouter = require('./route/authrouter');
let pandaRouter = require('./route/pandarouter');
let serverError = require('debug')('auth:error');

if (!process.env.APP_SECRET) throw new Error('Set env APP_SECRET');

mongoose.connect(MONGO_URI);

app.use(morgan('dev'));

app.use('/api', authRouter);
app.use('/api', pandaRouter);

app.use((err, req, res, next) => {
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
  next();
});

app.listen(port, () => {
  console.log('server up on ' + port);
});

module.exports = exports = app;
