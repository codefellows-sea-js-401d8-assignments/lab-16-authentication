'use strict';
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_dev');
let app = require('express')();
let authRouter = require('../route/auth_router');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use('/api', authRouter);
app.use((err, req, res, next)=>{
  res.status(err.statusCode || 500).json(err.err.message);
  next();
});

module.exports = exports = app;
