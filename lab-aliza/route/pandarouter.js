'use strict';

const Router = require('express').Router;
const PandaSchema = require('../model/pandamodel');
const HTTPError = require('http-errors');
const jwt_auth = require('../lib/auth_bearer');
let pandaRouter = Router();
var jsonParser = require('body-parser').json();

pandaRouter.use(jsonParser);

pandaRouter.get('/', (req, res) => {
  res.send('Panda DB. Enter /api/panda/<id> or /api/all');
});

pandaRouter.get('/all', (req, res) => {
  PandaSchema.find({})
  .exec((err, pandas) => {
    if (err) return HTTPError(404, 'not found');
    res.status(200).json(pandas);
  });
});

pandaRouter.get('/panda/:id', (req, res) => {
  PandaSchema.findOne({
    _id: req.params.id
  })
  .exec((err, pandas) => {
    if (err) return HTTPError(404, 'not found');
    res.status(200).json(pandas);
  });
});

pandaRouter.post('/panda', jsonParser, jwt_auth, (req, res) => {
  req.body.userId = req.user._id;
  new PandaSchema(req.body).save((err, panda) => {
    if(!req.body.name) return HTTPError(400, 'bad request');
    return res.status(200).send(panda);
  });
});

pandaRouter.put('/panda/:id', jsonParser, jwt_auth, (req, res) => {
  req.body.userId = req.user._id;
  PandaSchema.findOneAndUpdate({
    _id: req.params.id
  },
    { $set: {
      name: req.body.name,
      age: req.body.age,
      happy: req.body.happy
    }
  }, {upsert: true}, (err, newPanda) => {
    if (err) return HTTPError(400, 'bad request');
    if (!req.params.id) return HTTPError(404, 'not found');
    res.status(200).send(newPanda);
  });
});

pandaRouter.delete('/panda/:id', jsonParser, jwt_auth, (req, res) => {
  req.body.userId = req.user._id;
  PandaSchema.findOneAndRemove({
    _id: req.params.id
  }, (err, panda) => {
    if(err) return HTTPError(404, 'not found');
    return res.status(204).json(panda);
  });
});

module.exports = pandaRouter;
