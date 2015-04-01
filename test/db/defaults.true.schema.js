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
        canRead: true,
        canWrite: true
    }
});
module.exports = DefaultsSchema;
