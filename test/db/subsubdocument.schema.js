'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SubdocumentSchema = require('./subdocument.schema');
var mongooseContextProtectedPlugin = require('../..');

var SubSubdocumentSchema = new Schema({
    truthy: {
        type: [SubdocumentSchema],
        canRead: true,
        canWrite: true
    }
});

SubSubdocumentSchema.plugin(mongooseContextProtectedPlugin);
module.exports = SubSubdocumentSchema;
