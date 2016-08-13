'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const morgan = require('morgan');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/auth_dev';
let app = require('express')();
let userRouter = require('../route/userrouter');
let pandaRouter = require('../route/pandarouter');

if (!process.env.APP_SECRET) throw new Error('Set env APP_SECRET');

mongoose.connect(MONGO_URI);

app.use(morgan('dev'));

app.use('/api', userRouter);
app.use('/api', pandaRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json(err.message);
  next();
});

module.exports = exports = app;
