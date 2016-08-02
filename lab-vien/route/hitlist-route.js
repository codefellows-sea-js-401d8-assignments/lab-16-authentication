'use strict';

const express = require('express');
const Hitlist = require('../model/Hitlist');
const jsonParser = require('body-parser').json();
const AppError = require('../lib/AppError');
const hitlistEntryRouter = require('./hitlist_entry_route');

let hitlistRouter = module.exports = exports = express.Router();

hitlistRouter.get('/all', (req, res) => {
  Hitlist.find({})
  .then((hitlist) => {
    return res.json(hitlist);
  })
  .catch((err) => res.sendError(err));
});

hitlistRouter.get('/:id', (req, res) => {
  let _id = req.params.id;
  if (!_id)
    return res.sendError(AppError.error404('get requested with no ID'));
  Hitlist.findById(_id)
  .then((hitlist) => {
    if (!hitlist)
      return res.sendError(AppError.error404('get requested with invalid ID'));
    return res.json(hitlist);
  })
  .catch((err) => res.sendError(err));
});

hitlistRouter.post('/', jsonParser, (req, res) => {
  if(!req.body || !req.body.hitman || !req.body.location || !req.body.note)
    return res.sendError(AppError.error400('post requested with invalid body'));

  Hitlist(req.body).save()
  .then((hitlist) => {
    res.json(hitlist);
  })
  .catch((err) => res.sendError(err));
});

hitlistRouter.put('/:id', jsonParser, (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('put requested with no ID'));

  if(!req.body)
    return res.sendError(AppError.error400('post requested with no body'));

  if(!req.body.hitman && !req.body.location && !req.body.note)
    return res.sendError(AppError.error400('post requested with invalid body'));

  Hitlist.findByIdAndUpdate(_id, req.body)
  .then((hitlist) => {
    if (!hitlist)
      return res.sendError(AppError.error404('put requested with invalid ID'));
    return res.send('successfully updated');
  })
  .catch((err) => {
    return res.sendError(err);
  });
});

hitlistRouter.delete('/:id', (req, res) => {
  let _id = req.params.id;
  if (!_id)
    return res.sendError(AppError.error404('delete requested with no ID'));
  Hitlist.findByIdAndRemove(_id)
  .then((hitlist) => {
    if (!hitlist)
      return res.sendError(AppError.error404('delete requested with invalid ID'));
    return res.status(204).end();
  })
  .catch((err) => {
    res.sendError(err);
  });
});

hitlistRouter.use('/:hitlistId/entry', hitlistEntryRouter);
