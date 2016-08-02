'use strict';

const express = require('express');
const handleError = require('http-errors');
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const basicHttp = require('../lib/basicHttp');

let userRouter = module.exports = exports = express.Router();

userRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.generateHash(req.body.password)
  .then(() => {
    newUser.save().then(res.json.bind(res));
  })
  .catch((err) => {
    err = handleError(400, 'Server Error');
    return next(err);
  });
});

userRouter.get('/signin', basicHttp, (req, res, next) => {
  let authError = next(handleError(500, 'Not Authenticated'));
  User.findOne({'basic.username': req.auth.username})
    .then((user) => {
      if (!user) return authError;
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});

userRouter.get('*', (req, res, next) => {
  next(handleError(404, 'Page not found!'));
});
