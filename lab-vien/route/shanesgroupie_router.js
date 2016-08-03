'use strict';

const ADMIN = 'admin';
const BASIC = 'basic';

const Shanesgroupie = require('../model/Shanesgroupie');
const jsonParser = require('body-parser').json();
const errorHandler = require('../lib/error_handler');
const Router = require('express').Router;
const httpError = require('http-errors');
const authBearerParser = require('../lib/auth_bearer_parser');
const authorization = require('../lib/authorization');

const shanesgroupieRouter = module.exports = Router();

// rules: only shane can post/put/delete, tokened users can get, untokened cannot do anything

shanesgroupieRouter.get('/', authBearerParser, authorization([BASIC]), (req, res, next) => {
  Shanesgroupie.find()
  .then(groupies => res.json(groupies))
  .catch(next);
});

shanesgroupieRouter.post('/', authBearerParser, authorization([ADMIN]), jsonParser, (req, res, next) => {
  req.body.userId = req.user._id;
  new Shanesgroupie(req.body).save()
  .then(res.json.bind(res))
  .catch(next);
});

shanesgroupieRouter.put('/:id', authBearerParser, authorization([ADMIN]), jsonParser, (req, res, next) => {
  let _id = req.params.id;
  if(!_id)
    return next(httpError(404, 'put requested with no ID'));

  if(!req.body)
    return next(httpError(400, 'put requested with no body'));

  if(!req.body.name && !req.body.location && !req.body.age)
    return next(httpError(404, 'put requested with invalid body'));

  Shanesgroupie.findByIdAndUpdate(_id, req.body)
  .then((hitlist) => {
    if (!hitlist)
      return next(httpError(404, 'put requested with invalid ID'));
    return res.send('successfully updated');
  })
  .catch(err => next(err));
});

// bearRouter.post('/', jsonParser, jwt_auth, authzn(['wrangler']), (req, res, next) => {
//   req.body.wranglerId = req.user._id;
//   new Bear(req.body).save().then(res.json.bind(res), ErrorHandler(400, next));
// });
