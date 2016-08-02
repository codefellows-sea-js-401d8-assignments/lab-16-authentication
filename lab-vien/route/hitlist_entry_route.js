'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const AppError = require('../lib/AppError');

const findHitlistMiddleware = require('../lib/findHitlist');

let hitlistEntryRouter = module.exports = exports = express.Router({mergeParams: true});

hitlistEntryRouter.use(findHitlistMiddleware());

hitlistEntryRouter.get('/', (req, res) => {
  req.hitlist.findAllHits()
  .then((hits) => {
    return res.json(hits);
  })
  .catch((err) => {
    return res.sendError(err);
  });
});

hitlistEntryRouter.post('/', jsonParser, (req, res) => {
  if(!req.body || !req.body.name || !req.body.time || !req.body.price)
    return res.sendError(AppError.error400('post requested with invalid body'));

  req.hitlist.addNewHit(req.body)
  .then((hit) => {
    return res.json(hit);
  })
  .catch((err) => {
    return res.sendError(err);
  });
});

hitlistEntryRouter.put('/:id', (req, res) => {
  let _id = req.params.id;
  if (!_id)
    return res.sendError(AppError.error404('put request with no ID'));

  req.hitlist.addHit(_id)
  .then((hit) => {
    if (!hit)
      return res.sendError(AppError.error404('put request with invalid ID'));
    return res.json('successfully added hit');
  })
  .catch((err) => {
    return res.sendError(err);
  });
});

hitlistEntryRouter.delete('/:id', (req, res) => {
  let _id = req.params.id;
  if (!_id)
    return res.sendError(AppError.error404('put request with no ID'));

  req.hitlist.removeHit(_id)
  .then((hit) => {
    if (!hit)
      return res.sendError(AppError.error404('put request with invalid ID'));
    return res.json('successfully removed hit');
  })
  .catch((err) => {
    return res.sendError(err);
  });
});
