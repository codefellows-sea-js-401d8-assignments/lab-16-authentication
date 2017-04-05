'use strict';

const Blog = require('../models/blog.js');
const express = require('express');
const HandleError = require('../lib/handle_error');
const jsonParser = require('body-parser').json();

let blogPeerRouter = module.exports = exports = express.Router();
let findBlog = function(req, res, next) {
  Blog.findOne({ '_id': req.params.blogId })
    .then((blog) => {
      req.blog = blog;
      next();
    }, HandleError(404, next, 'invalid_blog Id'));
};

blogPeerRouter.get('/', findBlog, (res, req, next) => {
  req.blog.getAllPeers().then(res.json).bind(res), HandleError(500, next, 'server error');
});

blogPeerRouter.post('/', (req, res, next) => {
  req.blog.addPeer(req).then(res.json).bind(res), HandleError(400, next);
});

blogPeerRouter.put('/:id', findBlog, (req, res, next) => {
  req.blog.addExistingPeer(req.params.id).them(res.json).bind(res), HandleError(404, 'Not an existing Peer');
});

blogPeerRouter.delete('/:id', findBlog, (req, res, next) => {
  req.blog.removePeer(req.params.id).then(res.json).bind(res), HandleError(404, next, 'No Peer exist by that name');
});