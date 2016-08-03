'use strict';

const Shanesgroupie = require('../models/Shanegroupie');
const jsonParser = require('body-parser').json();
const errorHandler = require('../lib/error_handler');
const Router = require('express').Router;
const httpError = require('http-errors');

const shanesgroupieRouter = module.exports = Router();

// rules: only shane can post/put/delete, tokened users can get, untokened cannot do anything

shanesgroupieRouter.get('/', (req, res, next) => {
  Shanesgroupie.find()
  .then(groupies => res.json(groupies))
  .catch(next);
});

// bearRouter.post('/', jsonParser, jwt_auth, authzn(['wrangler']), (req, res, next) => {
//   req.body.wranglerId = req.user._id;
//   new Bear(req.body).save().then(res.json.bind(res), ErrorHandler(400, next));
// });
