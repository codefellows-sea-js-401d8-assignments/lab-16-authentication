'use strict';

const TF2 = require('../model/tf2');
const jsonParser = require('body-parser').json();
const handleError = require('../lib/handleError');
const jwtAuth = require('../lib/jwtAuth');
const authorization = require('../lib/authorization');

let tf2Router = module.exports = exports = require('express').Router();

tf2Router.get('/', (req, res, next) => {
  TF2.find().then(res.json.bind(res), handleError(500, next, 'Server ERROR!'));
});

tf2Router.post('/', jsonParser, jwtAuth, (req, res, next) => {
  req.body.announcerId = req.user._id;
  var tf2 = new TF2(req.body)
  tf2.save().then(res.json.bind(res), handleError(400, next));
});
