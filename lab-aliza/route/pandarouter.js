'use strict';

const Router = require('express').Router;
const debug = require('debug');
const serverlog = debug('serverlog');
const Panda = require('../model/pandamodel');
const authorization = require('../lib/authorization');
const HTTPError = require('http-errors');
const err400 = HTTPError(400, 'bad request');
const err404= HTTPError(404, 'not valid');
const jwtAuth = require('../lib/jwtauth');
let pandaRouter = Router();
var bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let urlParser = bodyParser.urlencoded({
  extended: true
});
pandaRouter.use(jsonParser);
pandaRouter.use(urlParser);

pandaRouter.get('/', (req, res) => {
  res.send('Panda DB. Enter /api/panda/<id> or /api/all');
});

pandaRouter.get('/all', (req, res) => {
  Panda.find({})
  .exec((err, pandas) => {
    if (err) return err404;
    res.status(200).json(pandas);
    serverlog('pandas: ', pandas);
  });
});

pandaRouter.get('/panda/:id', (req, res) => {
  Panda.findOne({
    _id: req.params.id
  })
  .exec((err, pandas) => {
    if (err) return err404;
    serverlog('pandas: ', pandas);
    res.status(200).json(pandas);
  });
});

pandaRouter.post('/panda', jsonParser, jwtAuth, authorization(['zookeeperId']), (req, res) => {
  req.body.zookeeperId = req.user._id;
  new Panda(req.body).save((err, panda) => {
    if(!req.body.name || !req.body.happy || !req.body.age) return err400;
    serverlog('panda: ', panda);
    return res.status(200).send(panda);
  });
});

pandaRouter.put('/panda/:id', jsonParser, jwtAuth, authorization(['zookeeperId']), (req, res) => {
  req.body.zookeeperId = req.user._id;
  Panda.findOneAndUpdate({
    _id: req.params.id
  },
    { $set: {
      name: req.body.name,
      age: req.body.age,
      happy: req.body.happy
    }
  }, {upsert: true}, (err, newPanda) => {
    if (err) return err400;
    if (!req.params.id) return err404;
    res.status(200).send(newPanda);
    serverlog('updated panda: ', newPanda);
  });
});

pandaRouter.delete('/panda/:id', jsonParser, jwtAuth, authorization(['zookeeperId']), (req, res) => {
  req.body.zookeeperId = req.user._id;
  Panda.findOneAndRemove({
    _id: req.params.id
  }, (err, panda) => {
    if(err) return err404;
    return res.status(204).json(panda);
  });
});

module.exports = pandaRouter;
