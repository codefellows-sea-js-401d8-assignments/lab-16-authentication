'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const User = require('../model/usermodel');
const BasicHTTP = require('../lib/basichttp');
const httpError = require('http-errors');

let authRouter = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let err400 = httpError(400, 'bad request');
  if (!req.body.username && !req.body.password) next(err400);
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then((token) => {
      newUser.save((err, user) => {
        if (err) next(err400);
        if (user) return res.json(token);
      });
    });
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let err401 = httpError(401, 'unauthorized');
  if (!req.auth.username && !req.auth.password) next(err401);
  User.findOne({username: req.auth.username}, (err, user) => {
    if (err || !user) return next(err401);
    user.comparePassword(req.auth.password)
      .then(res.json.bind(res))
      .catch((err) => {
        next(err);
      });
  });
});

module.exports = exports = authRouter;
