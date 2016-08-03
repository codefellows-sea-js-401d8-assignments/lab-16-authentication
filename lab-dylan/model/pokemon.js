'use strict';
const mongoose = require('mongoose');

module.exports = exports = mongoose.model('Pokemon', {
  name: {type: String, required: true},
  element: {type: String, default:'normal'},
  number: Number,
  trainerId: String
});
