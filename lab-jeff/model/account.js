'use strict';

const mongoose = require('mongoose');

let AccountSchema = new mongoose.Schema({
  accountType: {type: String, required: true, default: 'checking'},
  accountNumber: {type: String, required: true},
  accountOwner: String
});

module.exports = exports = mongoose.model('Account', AccountSchema);
