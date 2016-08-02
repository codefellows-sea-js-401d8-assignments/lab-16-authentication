'use strict';

const Router = require('express').Router;
const User = require('../model/User');
const jsonParser = require('body-parser').json();
const authParser = require('../lib/auth_parser');
const httpError = require('http-errors');
const authRouter = module.exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  if(!req.body || !req.body.username || !req.body.password || !req.body.email) {
    next(httpError(400, 'required fields not satisfied'));
  }

  newUser.username = req.body.username;
  newUser.basic.email = req.body.email;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save()
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => {
          next(err); // 500
        });
    })
    .catch((err) => {
      next(err);
    });
});
