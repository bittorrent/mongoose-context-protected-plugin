var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseContextProtectedPlugin = require('../..');

var TestSchema = new Schema({
    implicit: {
        type: String
    },
    truthy: {
        type: String,
        canRead: true,
        canWrite: true
    },
    falsy: {
        type: String,
        canRead: false,
        canWrite: false
    },
    func: {
        type: String,
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

TestSchema.plugin(mongooseContextProtectedPlugin);
module.exports = TestSchema;
