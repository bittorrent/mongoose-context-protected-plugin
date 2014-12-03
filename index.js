'use strict';

var _ = require('lodash');
var q = require('q');
var assert = require('assert');
var debug = require('debug')('mongoose-context-protected-plugin:plugin');

var DEFAULT_CAN_READ = true;
var DEFAULT_CAN_WRITE = false;

module.exports = function mongooseContextProtectedPlugin (schema, options) {
    options = _.defaults(options || {}, {
        defaultCanWrite: DEFAULT_CAN_WRITE,
        defaultCanRead: DEFAULT_CAN_READ
    });

    var canReadDocumentKey = function (context, doc, key) {
        var schema = doc.schema.path(key);
        assert(schema, key + ' schema path not found');
        var canRead = schema.options.canRead;
        if (_.isBoolean(canRead)) {
            return canRead;
        } else if (_.isFunction(canRead)) {
            return canRead.call(doc, context);
        } else {
            return options.defaultCanRead;
        }
    };

    var canWriteDocumentKey = function (context, doc, key) {
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
            var canWriteDefault = options.defaultCanWrite;
            if (!canWriteDefault) {
                debug('write permission for %s defaulted to false', key);
            }
            return canWriteDefault;
        }
    };

    var contextProtectedRead = function (context, doc) {
        var ret = {};
        _(doc.toObject()).keys().filter(function (key) {
            return canReadDocumentKey(context, doc, key);
        }).each(function (key) {
            if (doc.populated(key)) {
                assert(doc.get(key).contextProtectedRead, 'contextProtectedRead not defined on reference document');
                ret[key] = doc.get(key).contextProtectedRead(context);
            } else if (doc.schema.path(key).options.type instanceof Array) {
                assert(doc.schema.path(key).options.type[0].methods.contextProtectedRead, 'contextProtectedRead not defined on subdocument array');
                ret[key] = _.map(doc.get(key), function (elem) {
                    return doc.schema.path(key).options.type[0].methods.contextProtectedRead.call(elem, context);
                });
            } else {
                ret[key] = doc.get(key);
            }
        });
        return ret;
    };

    var contextProtectedWrite = function (context, doc, attr) {
        debug('contextProtectedWrite %o, %o', context, attr);
        return q.resolve().then(function () {
            var canWriteAll = _.all(attr, function (value, key) {
                return canWriteDocumentKey(context, doc, key);
            });
            assert(canWriteAll, 'insufficient permission');
        }).then(function () {
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
