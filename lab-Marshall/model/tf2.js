'use strict';

const mongoose = require('mongoose');

module.exports = exports = mongoose.model('Classes', {
  class: {type: String, default: 'Scout', required: true},
  gun: {type: String, default: 'Shotgun'},
  melee: {type: String, default: 'Baseball and a bat'},
  announcerId: String
});
