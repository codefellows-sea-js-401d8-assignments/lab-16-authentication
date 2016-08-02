'use strict';

const User = require('../model/user.js');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const AppError = require('../lib/response_error');
const basicHttp = require('../lib/basic_http.js');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  console.log(req.body.email);
  // console.log(req.auth.username);
  User.findOne({'basic.email': req.body.email})
  .then((err,user) =>{
    if(err) return err;
    if(user) return res.sendError(AppError.error400('Email already registerd to a user'));
  });
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.createHash(req.body.password)
    .then(() => {
      newUser.save((err, data) => {
        if (err) return err;
        if (!data) return res.sendError(AppError.error404('Invalid data'));
        return res.json(data);
      });
      // next();
    });
});

authRouter.get('/signin', basicHttp, (req, res, next) => {
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      console.log(user);
      if (!user) return res.sendError(AppError.error404('User does not exist'));
      user.comparePassword(req.auth.password)
        .then(() => {
          return res.json(user);
        });
      // next();
    });
});
