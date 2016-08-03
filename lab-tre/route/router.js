'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const ErrorHandler = require('../lib/error_handler');
const User = require('../model/user');
const BasicHttp = require('../lib/basic_http');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.username = req.body.username;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save().then(res.json.bind(res), ErrorHandler(400, next));
    }, ErrorHandler(500, next, 'Server Error'));
});

authRouter.get('/signin', BasicHttp, (req, res, next) => {
  let authError = ErrorHandler(401, next, 'Authentication denied');
  User.finOne({'basic.username': req.auth.username})
    .then((user) => {
      if (!user) return next(authError);
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), authError);
    }, authError);
});

authRouter.get('*', (req, res, next) => {
  next(ErrorHandler(404, 'Page not found!'));
});
