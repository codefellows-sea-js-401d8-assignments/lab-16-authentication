'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const Hit = require('../model/Hit');
const AppError = require('../lib/AppError');
const mongoose = require('mongoose');

const hitRouter = module.exports = Router();

hitRouter.get('/all', (req, res) => {
  Hit.find({}, (err, hits) => {
    if (err)
      return res.sendError(err); // 500, not AppError
    res.json(hits);
  });
});

hitRouter.get('/:id', (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('get requested with no ID'));
  Hit.findById(_id, (err, hit) => {
    if (!hit)
      return res.sendError(AppError.error404('get requested with invalid ID'));
    if (err)
      return res.sendError(err);
    return res.json(hit);
  });
});

hitRouter.post('/', jsonParser, (req, res) => {
  if(!req.body || !req.body.name || !req.body.time || !req.body.price)
    return res.sendError(AppError.error400('post requested with invalid body'));

  let newHit = new Hit(req.body);
  newHit.save((err, hit) => {
    if (err)
      return res.sendError(err); // 500 not AppError

    res.json(hit);
  });
});

hitRouter.put('/:id', jsonParser, (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('put requested with no ID'));

  if(!req.body)
    return res.sendError(AppError.error400('put requested with no body'));

  if(!req.body.name && !req.body.location && !req.body.price && !req.body.hitlistId)
    return res.sendError(AppError.error400('put requested with invalid body'));

  Hit.findByIdAndUpdate(_id, req.body, (err, hit) => {
    if (!hit)
      return res.sendError(AppError.error404('put requested with invalid ID'));
    if (err)
      return res.sendError(err);
    res.send('successfully updated');
  });
});

hitRouter.delete('/all', (req, res) => {
  mongoose.connection.db.dropDatabase(function() {
    console.log('database destroyed');
  });
  res.status(204).end();
});

hitRouter.delete('/:id', (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('delete requested with no ID'));
  Hit.findByIdAndRemove(_id, (err, hit) => {
    if (!hit)
      return res.sendError(AppError.error404('delete requested with invalid ID'));
    if (err)
      return res.sendError(err);
    res.status(204).end();
  });
});
