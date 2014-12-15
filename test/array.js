'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var Arr = require('./db/array.model');

describe('mongoose-context-protected-plugin array type', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var DATA = {
                implicit: ['implicitvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(void 0);
            }).then(function (data) {
                var arrayData = _.pick(data, 'implicit');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to true', function (done) {
            var DATA = {
                truthy: ['truthyvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(void 0);
            }).then(function (data) {
                var arrayData = _.pick(data, 'truthy');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to false', function (done) {
            var DATA = {
                falsy: ['falsyvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(void 0);
            }).then(function (data) {
                var arrayData = _.pick(data, 'falsy');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning false', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(false);
            }).then(function (data) {
                var arrayData = _.pick(data, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning true', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(true);
            }).then(function (data) {
                var arrayData = _.pick(data, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to false', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(q.resolve(false));
            }).then(function (data) {
                var arrayData = _.pick(data, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to true', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedRead(q.resolve(true));
            }).then(function (data) {
                var arrayData = _.pick(data, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });

    describe('contextProtectedWrite', function () {
        it('tests write on key with implicit default canWrite', function (done) {
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(void 0, {
                    implicit: ['implicitvalue']
                });
            }).then(function () {
                assert(false, 'expected insufficient permission assertion error');
            }, function (err) {
                assert(err.name === 'AssertionError', 'expected an assertion error');
                assert(err.message === 'insufficient permission', 'expected insufficient permission');
            }).nodeify(done);
        });

        it('tests write on key with canWrite set to true', function (done) {
            var DATA = {
                truthy: ['truthyvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(void 0, DATA);
            }).then(function (doc) {
                var arrayData = _.pick(doc, 'truthy');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'model data must match write data');
            }).nodeify(done);
        });

        it('tests write on key with canWrite set to false', function (done) {
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(void 0, {
                    falsy: ['falsyvalue']
                });
            }).then(function () {
                assert(false, 'expected insufficient permission assertion error');
            }, function (err) {
                assert(err.name === 'AssertionError', 'expected an assertion error');
                assert(err.message === 'insufficient permission', 'expected insufficient permission');
            }).nodeify(done);
        });

        it('tests write on key with canWrite returning false', function (done) {
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(false, {
                    func: ['funcvalue']
                });
            }).then(function () {
                assert(false, 'expected insufficient permission assertion error');
            }, function (err) {
                assert(err.name === 'AssertionError', 'expected an assertion error');
                assert(err.message === 'insufficient permission', 'expected insufficient permission');
            }).nodeify(done);
        });

        it('tests write on key with canWrite returning true', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(true, DATA);
            }).then(function (doc) {
                var arrayData = _.pick(doc, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'model data must match write data');
            }).nodeify(done);
        });

        it('tests write on key with canWrite resolving to false', function (done) {
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(q.resolve(false), {
                    func: ['funcvalue']
                });
            }).then(function () {
                assert(false, 'expected insufficient permission assertion error');
            }, function (err) {
                assert(err.name === 'AssertionError', 'expected an assertion error');
                assert(err.message === 'insufficient permission', 'expected insufficient permission');
            }).nodeify(done);
        });

        it('tests write on key with canWrite resolving to true', function (done) {
            var DATA = {
                func: ['funcvalue']
            };
            q.resolve().then(function () {
                var doc = new Arr();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(q.resolve(true), DATA);
            }).then(function (doc) {
                var arrayData = _.pick(doc, 'func');
                debug('%o', arrayData);
                assert(_.isEqual(arrayData, DATA), 'model data must match write data');
            }).nodeify(done);
        });
    });
});