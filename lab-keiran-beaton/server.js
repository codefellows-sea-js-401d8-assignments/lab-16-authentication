'use strict';

if (!process.env.APP_SECRET) throw new Error('Please set up the env APP_SECRET');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:auth_dev');
let app = require('express')();
let authRouter = require('./route/authRouter');
let serverError = require('debug')('cflab:error');

app.use('/api', authRouter);

app.use((err, req, res, next) => {
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
});
app.listen(3000, () => console.log('server is up'));
