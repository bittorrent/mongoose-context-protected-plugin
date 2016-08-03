'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');
var Test = require('./db/test.model');

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');*/

describe('mongoose-context-protected-plugin native type', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };

            let test = new Test(DATA);
            
            test.save().then(function(test) {
                return test.contextProtectedRead(void 0);
            }).then(function(data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'read data must match model initialization data');
            }).then(done);
        });

        it('tests read on key with canRead set to true', function (done) {
            var DATA = {
                truthy: 'truthyvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(void 0);
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to false', function (done) {
            var DATA = {
                falsy: 'falsyvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(void 0);
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning false', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(false);
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning true', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(true);
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to false', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(q.resolve(false));
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to true', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedRead(q.resolve(true));
            }).then(function (data) {
                var testData = _.omit(data, '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });

    describe('contextProtectedWrite', function () {
        it('tests write on key with implicit default canWrite', function (done) {
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(void 0, {
                    implicit: 'implicitvalue'
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
                truthy: 'truthyvalue'
            };
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(void 0, DATA);
            }).then(function (test) {
                var testData = _.omit(test.toObject(), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'model data must match write data');
            }).nodeify(done);
        });

        it('tests write on key with canWrite set to false', function (done) {
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(void 0, {
                    falsy: 'falsyvalue'
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
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(false, {
                    func: 'funcvalue'
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
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(true, DATA);
            }).then(function (test) {
                var testData = _.omit(test.toObject(), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'model data must match write data');
            }).nodeify(done);
        });

        it('tests write on key with canWrite resolving to false', function (done) {
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(q.resolve(false), {
                    func: 'funcvalue'
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
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(q.resolve(true), DATA);
            }).then(function (test) {
                var testData = _.omit(test.toObject(), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'model data must match write data');
            }).nodeify(done);
        });
    });
});