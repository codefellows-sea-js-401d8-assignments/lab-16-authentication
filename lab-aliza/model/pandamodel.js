'use strict';
const mongoose = require('mongoose');

module.exports = exports = mongoose.model('Panda', {
  name: {type: String, required: true},
  favoriteColor: String,
  age: Number,
  userId: String
});
