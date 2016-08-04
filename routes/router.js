'use strict';

const express = require('express');
const Blog = require('../models/blog.js');
const jsonParser = require('body-parser').json();
const HandleError = require('../lib/handle_error.js');

let thirdRouter = require('./third_party_router.js');
let blogPeerRouter = require('./blog_peer_router.js');
let blogRouter = module.exports = exports = express.Router();

blogRouter.get('/', (req, res, next) => {
  let handleDbError = HandleError(400, next, 'invalid id');
  Blog.find({'_id': req.params.id}).then(res.json.bind(res), handleDbError);
});

blogRouter.post('/', jsonParser, (req, res, next) => {
  (Blog(req.body)).save().then(res.json.bind(res), HandleError(400, next));
});

blogRouter.put('/:id', jsonParser, (res, req, next) => {
  (Blog.findAndUpdate({'_id': req.params.id}, req.body).then(res.json.bind(res), HandleError(400, next)));
});

blogRouter.delete('/:id', (req, res, next) => {
  (Blog.remove({'_id': req.params.id}).then(res.json).bind(res), HandleError(400, next, 'invalid_id'));
});

blogRouter.use('/:blogId/peer', blogPeerRouter);
