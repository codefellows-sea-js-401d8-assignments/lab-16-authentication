'use strict';
if(!process.env.APP_SECRET) throw new Error('APP_SECRET must be set');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth_dev');
const express = require('express');
const PORT = process.env.PORT || 3000;
let app = express();
let authRouter = require('./route/auth_router');
let serverError = require('debug')('servererror');

app.use('/api', authRouter);

app.use((err, req, res, next) => {
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
});


app.listen(PORT, () => {
  console.log('server up');
});
