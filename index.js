'use strict';

var _ = require('lodash');
var q = require('q');
var assert = require('assert');
var debug = require('debug')('mongoose-user-protected-plugin:plugin');

var DEFAULT_CAN_READ = true;
var DEFAULT_CAN_WRITE = false;

module.exports = function mongooseUserProtectedPlugin (schema, options) {
    options = _.defaults(options || {}, {
        defaultCanWrite: DEFAULT_CAN_WRITE,
        defaultCanRead: DEFAULT_CAN_READ
    });
    _.extend(schema.methods, {
        userProtectedRead: function (user) {
            var obj = this.toObject();
            var ret = _.pick(obj, function (value, key) {
                var path = this.schema.path(key);
                assert(path, key + ' schema path not found');
                var canRead = path.options.canRead;
                if (_.isBoolean(canRead)) {
                    return canRead;
                } else if (_.isFunction(canRead)) {
                    return canRead.call(this, user);
                } else {
                    return options.defaultCanRead;
                }
            }.bind(this));
            return ret;
        },

        userProtectedWrite: function (user, attr) {
            debug('userProtectedWrite %o, %o', user, attr);
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
                        var canWriteRes = canWrite.call(this, user);
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
                debug('userProtectedWrite permitted %o', attr);
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
