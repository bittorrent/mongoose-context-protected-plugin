'use strict';

var mongoose = require('mongoose');
module.exports = mongoose.model('Defaults', require('./defaults.schema'));
