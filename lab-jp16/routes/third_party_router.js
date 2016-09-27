'use strict';

const express = require('express');
const HandleError = require('../lib/handle_error.js');
const Blog = require('../models/blog.js');
const jsonParser = require('body-parser').json();

let thirdRouter = module.exports = exports = express.Router();
let findBlog = function(req, res, next) {

};