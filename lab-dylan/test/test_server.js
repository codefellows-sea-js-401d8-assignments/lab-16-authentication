'use strict';

const mongoose = require('mongoose');
const jwt_auth = require('../lib/jwt_auth');
const Promise = require('../lib/promise');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth_test');
let app = require('express')();
const morgan = require('morgan');

const authRouter = require('../route/auth_router');
// const pokemonRouter = require('../route/pokemon-router');
app.use(morgan('dev'));

app.use('/api', authRouter);
app.get('/api/jwt_auth', jwt_auth, function(req, res) {
  res.json({msg: 'success'});
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});

app.listen(5000);
