'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../models/user');
const BasicHTTP = require('../lib/basic_http');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  if (!req.body.email || !req.body.password) return next(createError(400, 'Bad Request'));
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then((data) => {
      newUser.save((err) => {
        if (err) return next(createError(400, 'bad req'));
        return res.json(data);
      });
    });
});

authRouter.get('/signin', BasicHTTP, (req, res, next) => {
  let authError = createError(401, 'Bad Authentication');
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if (!user) return next(authError);
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res))
        .catch((err) => {
          next(authError)
        })
    });
});
