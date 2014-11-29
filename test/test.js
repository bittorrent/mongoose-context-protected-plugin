'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var Test = require('./db/test.model');

describe('mongoose-context-protected-plugin native type', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var testData = _.omit(test.contextProtectedRead(void 0), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, DATA), 'read data must match model initialization data');
            }).nodeify(done);
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
                var testData = _.omit(test.contextProtectedRead(void 0), '_id', '__v');
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
                var testData = _.omit(test.contextProtectedRead(void 0), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to false', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var testData = _.omit(test.contextProtectedRead(false), '_id', '__v');
                debug('%o', testData);
                assert(_.isEqual(testData, {}), 'read data must be empty');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to true', function (done) {
            var DATA = {
                func: 'funcvalue'
            };
            q.resolve().then(function () {
                var test = new Test(DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var testData = _.omit(test.contextProtectedRead(true), '_id', '__v');
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
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(void 0, {
                    truthy: 'truthyvalue'
                });
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

        it('tests write on key with canWrite evaluating to false', function (done) {
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

        it('tests write on key with canWrite evaluating to true', function (done) {
            q.resolve().then(function () {
                var test = new Test();
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                return test.contextProtectedWrite(true, {
                    func: 'funcvalue'
                });
            }).nodeify(done);
        });
    });
});