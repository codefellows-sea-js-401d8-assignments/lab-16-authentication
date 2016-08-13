'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const UserSchema = require('../model/usermodel');
const BasicHTTP = require('../lib/http_handle');
const HTTPError = require('http-errors');

let userRouter = Router();

userRouter.post('/signup', jsonParser, (req, res, next) => {
  if (!req.body.username && !req.body.password) next(HTTPError(400, 'bad request'));
  let newUser = new UserSchema();
  newUser.basic.username = req.body.username;  newUser.createHash(req.body.password)
    .then((hash) => {
      newUser.save((err, user) => {
        if (err) return next(HTTPError(400, 'bad request'));
        if (user) return res.json(hash);
      });
    });
});

userRouter.get('/signin', BasicHTTP, function(req, res, next) {
  let DBError = HTTPError(400, next, 'invalid id');
  let Err404 = HTTPError(404, next, 'could not authorize');
  if(!req.auth.username || !req.auth.password) return Err404();
  UserSchema.findOne({'basic.username': req.auth.username})
    .then((user) => {
      if (!user) return Err404();
      user.comparePass(req.auth.password)
        .then(res.json.bind(res), Err404);
    }, DBError);
});

module.exports = exports = userRouter;
