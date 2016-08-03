'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const User = require('../model/usermodel');
const BasicHTTP = require('../lib/basichttp');
const HTTPError = require('http-errors');
const err400 = HTTPError(400, 'bad request');
const err401 = HTTPError(401, 'unauthorized');

let authRouter = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  if (!req.body.username && !req.body.password) next(err400);
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then((hash) => {
      newUser.save((err, user) => {
        if (err) return next(err400);
        if (user) return res.json(hash);
      });
    });
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
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
