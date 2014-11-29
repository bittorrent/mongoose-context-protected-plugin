'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TestSchema = require('./test.schema');
var mongooseContextProtectedPlugin = require('../..');

var SubdocumentSchema = new Schema({
    implicit: {
        type: [TestSchema],
    },
    truthy: {
        type: [TestSchema],
        canRead: true,
        canWrite: true
    },
    falsy: {
        type: [TestSchema],
        canRead: false,
        canWrite: false
    },
    func: {
        type: [TestSchema],
        canRead: function (canRead) {
            // allow the test to dictate whether this should be allowed or not
            return canRead;
        },
        canWrite: function (canWrite) {
            // allow the test to dictate whether this should be allowed or not
            return canWrite;
        }
    }
});

SubdocumentSchema.plugin(mongooseContextProtectedPlugin);
module.exports = SubdocumentSchema;
