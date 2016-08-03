'use strict';
process.env.APP_SECRET = 'This is the APP SECRET';
if(!process.env.APP_SECRET) throw new Error('APP_SECRET must be set');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth_dev');
const PORT = process.env.PORT || 3000;

let app = require('express')();

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
