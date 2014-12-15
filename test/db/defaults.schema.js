'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseContextProtectedPlugin = require('../..');

var DefaultsSchema = new Schema({
    implicit: {
        type: String
    }
});

DefaultsSchema.plugin(mongooseContextProtectedPlugin, {
    defaults: {
        canRead: false,
        canWrite: true
    }
});
module.exports = DefaultsSchema;
