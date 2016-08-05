'use strict';
module.exports = (typeof Promise !== 'undefined') ? Promise : require('bluebird');
