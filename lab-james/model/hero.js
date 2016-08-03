'use strict';
const mongoose = require('mongoose');
// const User = require('../model/user');

let HeroSchema = mongoose.Schema({
  name: {type: String, required: true},
  race: {type: String, required: true},
  faction: {type: String, required: true},
  userId: String
});

module.exports = exports = mongoose.model('hero', HeroSchema);
