'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Promise = require('promise');
mongoose.Promise = Promise;

let createError = require('http-errors');
if (!process.env.APP_SECRET) throw new createError(400, 'Please set the env APP_SECRET');
const morgan = require('morgan');

let LOCAL_DB_SERVER = process.env.MONGOLAB_URI || 'mongodb://localhost/dev_db';
mongoose.connect(LOCAL_DB_SERVER);

const authRouter = require('../route/auth_router');

app.use(morgan('dev'));
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'Database error');
  next();
});

module.exports = exports = app;
