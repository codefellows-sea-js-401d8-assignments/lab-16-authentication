'use strict';

const mongoose = require('mongoose');

let Peer = module.exports = exports = mongoose.model('Peer', {
  name: { type: String, required: true },
  politicalPreference: { type: String, default: 'Independent' },
  politicalViews: { type: String, default: 'Middle of the road' },
  blogId: String
});