'use strict';

var util = require('util');
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
    _.extend(schema.methods, {
        contextProtectedRead: function (context) {
            var ret = {};
            _(this.toObject()).keys().filter(function (key) {
                var schema = this.schema.path(key);
                assert(schema, key + ' schema path not found');
                var canRead = schema.options.canRead;
                if (_.isBoolean(canRead)) {
                    return canRead;
                } else if (_.isFunction(canRead)) {
                    return canRead.call(this, context);
                } else {
                    return options.defaultCanRead;
                }
            }.bind(this)).each(function (key) {
                if (this.populated(key)) {
                    assert(this.get(key).contextProtectedRead, 'contextProtectedRead not defined on reference document');
                    ret[key] = this.get(key).contextProtectedRead(context);
                } else if (this.schema.path(key).options.type instanceof Array) {
                    assert(this.schema.path(key).options.type[0].methods.contextProtectedRead, 'contextProtectedRead not defined on subdocument array');
                    ret[key] = _.map(this.get(key), function (elem) {
                        return this.schema.path(key).options.type[0].methods.contextProtectedRead.call(elem, context);
                    }, this);
                } else {
                    ret[key] = this.get(key);
                }
            }, this);
            return ret;
        },

        contextProtectedWrite: function (context, attr) {
            debug('contextProtectedWrite %o, %o', context, attr);
            return q.resolve().then(function () {
                var canWriteAll = _.all(attr, function (value, key) {
                    var path = this.schema.path(key);
                    if (!path) {
                        debug('schema path for %s does not exist', key);
                        return false;
                    }

                    var canWrite = path.options.canWrite;
                    if (_.isBoolean(canWrite)) {
                        if (!canWrite) {
                            debug('write permission for %s hard coded to false', key);
                        }
                        return canWrite;
                    } else if (_.isFunction(canWrite)) {
                        var canWriteRes = canWrite.call(this, context);
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
                }.bind(this));

                assert(canWriteAll, 'insufficient permission');
            }.bind(this)).then(function () {
                debug('contextProtectedWrite permitted %o', attr);
                _.extend(this, attr);
                var defer = q.defer();
                this.save(defer.makeNodeResolver());
                return defer.promise.spread(function (doc) {
                    return doc;
                });
            }.bind(this));
        }
    });
};
