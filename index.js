'use strict';

var _ = require('lodash');
var q = require('q');
var assert = require('assert');
var debug = require('debug')('mongoose-context-protected-plugin:plugin');

var DEFAULT_CAN_READ = true;
var DEFAULT_CAN_WRITE = false;

module.exports = function mongooseContextProtectedPlugin (schema, options) {
    options = options || {};
    options.defaults = _.defaults(options.defaults || {}, {
        canRead: DEFAULT_CAN_READ,
        canWrite: DEFAULT_CAN_WRITE
    });

    var canReadDocumentKey = function (context, doc, key) {
        return q.resolve().then(function () {
            var schema = doc.schema.path(key);
            assert(schema, key + ' schema path not found');
            var canRead = schema.options.canRead;
            if (_.isBoolean(canRead)) {
                return canRead;
            } else if (_.isFunction(canRead)) {
                return canRead.call(doc, context);
            } else {
                return options.defaults.canRead;
            }
        });
    };

    var canWriteDocumentKey = function (context, doc, key) {
        return q.resolve().then(function () {
            var path = doc.schema.path(key);
            if (!path) {
                debug('schema path for %s does not exist', key);
                return false;
            }
            debug('schema path %o', path);
            var canWrite = path.options.canWrite;
            if (_.isBoolean(canWrite)) {
                if (!canWrite) {
                    debug('write permission for %s hard coded to false', key);
                }
                return canWrite;
            } else if (_.isFunction(canWrite)) {
                var canWriteRes = canWrite.call(doc, context);
                if (!canWriteRes) {
                    debug('write permission for %s evaluated to false', key);
                }
                return canWriteRes;
            } else {
                var canWriteDefault = options.defaults.canWrite;
                if (!canWriteDefault) {
                    debug('write permission for %s defaulted to false', key);
                }
                return canWriteDefault;
            }
        });
    };

    var contextProtectedRead = function (context, doc) {
        var ret = {};
        return q.all(_.map(_.keys(doc.toObject()), function (key) {
            return canReadDocumentKey(context, doc, key).then(function (canRead) {
                if (canRead) {
                    if (doc.populated(key)) {
                        return contextProtectedRead(context, doc.get(key)).then(function (value) {
                            ret[key] = value;
                        });
                    } else {
                        ret[key] = doc.get(key);
                    }                    
                }
            });
        })).thenResolve(ret);
    };

    var contextProtectedWrite = function (context, doc, attr) {
        debug('contextProtectedWrite %o, %o', context, attr);
        return q.resolve().then(function () {
            return q.all(_.map(attr, function (value, key) {
                return canWriteDocumentKey(context, doc, key);
            }));
        }).then(function (canWrites) {
            assert(_.every(canWrites, _.identity), 'insufficient permission');
            debug('contextProtectedWrite permitted %o', attr);
            _.extend(doc, attr);
            var defer = q.defer();
            doc.save(defer.makeNodeResolver());
            return defer.promise.spread(function (doc) {
                return doc;
            });
        });
    };

    _.extend(schema.methods, {
        contextProtectedRead: function (context) {
            return contextProtectedRead(context, this);
        },

        contextProtectedWrite: function (context, attr) {
            return contextProtectedWrite(context, this, attr);
        }
    });
};
