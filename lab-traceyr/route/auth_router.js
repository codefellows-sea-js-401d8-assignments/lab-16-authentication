'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const ErrorHandle = require('../lib/err_response');
const User = require('../model/user_model');
const BasicHTTP = require('../lib/http_handle');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) =>{
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.createHash(req.body.password)
    .then((token) =>{
      newUser.save().then(() => {res.json(token);}, ErrorHandle(400, next));
    }, ErrorHandle(500, next, 'Server Error'));
});

authRouter.get('/signin', BasicHTTP, (req, res, next) =>{
  User.findOne({'basic.email': req.auth.username})
    .then((user)=>{
      if(!user) return ErrorHandle(401, next, 'Could not Authorize');
      user.comparePass(req.auth.password)
        .then(res.json.bind(res), ErrorHandle(401, next, 'Could Not Authorize'));
    }, ErrorHandle(401, next, 'Could Not Authorize'));
});
