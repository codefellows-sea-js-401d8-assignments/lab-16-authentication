'use strict';

const express = require('express');
let app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('./lib/promise');
mongoose.Promise = Promise;
const userRouter = require('./route/userRouter');
const accountRouter = require('./route/accountRouter');
const serverPort = 3000;

const mongoUserServer = 'mongodb://localhost/userDatabase';

mongoose.connect(mongoUserServer);

app.use(morgan('dev'));
app.use('/api/user', userRouter);
app.use('/api/account', accountRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json(err.message);
  next();
});


module.exports = exports = app.listen(serverPort, () => console.log('Server running at http://localhost:' + serverPort));
