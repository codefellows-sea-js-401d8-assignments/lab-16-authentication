'use strict';

const Account = require('../model/account');
const jsonParser = require('body-parser').json();
const jwtAuth = require('../lib/jwtAuth');

let accountRouter = module.exports = exports = require('express').Router();

accountRouter.get('/', (req, res, next) => {
  Account.find(req.body)
  .then(res.json.bind(res))
  .catch((err) => {
    return next(err);
  });
});

accountRouter.post('/', jsonParser, jwtAuth, (req, res, next) => {
  req.body.accountOwner = req.user._id;
  let newAccount = new Account(req.body);
  newAccount.save()
  .then((res.json.bind(res)))
  .catch((err) => {
    return next(err);
  });
});
