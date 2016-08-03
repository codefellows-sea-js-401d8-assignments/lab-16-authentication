'use strict';
const mongoose = require('mongoose');

module.exports = exports = mongoose.model('Panda', {
  name: {type: String, required: true},
  age: {type: Number, required: true},
  happy: {type: Boolean, required: true},
  zookeeperId: String
});
