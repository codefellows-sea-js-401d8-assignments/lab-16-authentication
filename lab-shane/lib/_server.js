'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const userServer = 'mongodb://localhost/user';
const testServer = process.env.mongoTestServer || userServer;
const resError = require('./response_error.js');
const authRouter = require('../route/auth_router.js');

let server = module.exports = exports = express();

mongoose.connect(testServer);

server.use(resError);

server.use('/api', authRouter);
