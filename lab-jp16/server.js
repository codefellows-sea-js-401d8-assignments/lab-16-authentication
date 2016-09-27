'use strict';

// npm modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// app modules


// constant variables
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/auth_dev';
let app = express();

//setup mongo
mongoose.connect(mongoURI);
mongoose.Promise = Promise;

//setup middleware
app.use(morgan('dev'));

// setup routes
let authRouter = require('./routes/auth_router.js');
let serverError = require('debug')('cfdeme:error');

app.use('/api', authRouter);

app.use((err, req, res, next) => {
  serverError(err);
  res.status(err.statusCode || 500).json(err.error.message);
});
app.listen(port, () => console.log('Server up', port));
module.exports = ('server');