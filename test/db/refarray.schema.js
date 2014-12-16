'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongooseContextProtectedPlugin = require('../..');

var RefSchema = new Schema({
    implicit: {
        type: [{
            type: ObjectId,
            ref: 'Test'
        }]
    },
    truthy: {
        type: [{
            type: ObjectId,
            ref: 'Test'
        }],
        canRead: true,
        canWrite: true
    },
    falsy: {
        type: [{
            type: ObjectId,
            ref: 'Test'
        }],
        canRead: false,
        canWrite: false
    },
    func: {
        type: [{
            type: ObjectId,
            ref: 'Test'
        }],
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

RefSchema.plugin(mongooseContextProtectedPlugin);
module.exports = RefSchema;
