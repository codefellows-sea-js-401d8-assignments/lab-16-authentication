'use strict';

const port = 3000;

if (!process.env.APP_SECRET) throw new Error('Set env APP_SECRET');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth_dev');
let app = require('express')();
let authRouter = require('./route/authrouter');
let serverError = require('debug')('auth:error');

app.use('/api', authRouter);

app.use((err, req, res) => {
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
});

app.listen(port, () => console.log('server up at ' + port));
