'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');

var SubDocumentTest = require('./db/subdocument.model');

describe('mongoose-context-protected-plugin subdocument', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var DATA = [{
                implicit: 'implicitvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            q.resolve().then(function () {
                var test = new SubDocumentTest(SUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var implicit = _.map(test.contextProtectedRead(void 0).implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to true', function (done) {
            var DATA = [{
                truthy: 'truthyvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            q.resolve().then(function () {
                var test = new SubDocumentTest(SUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var implicit = _.map(test.contextProtectedRead(void 0).implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to false', function (done) {
            var DATA = [{
                falsy: 'falsyvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            q.resolve().then(function () {
                var test = new SubDocumentTest(SUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var implicit = _.map(test.contextProtectedRead(void 0).implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, [{}]), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to false', function (done) {
            var DATA = [{
                func: 'funcvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            q.resolve().then(function () {
                var test = new SubDocumentTest(SUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var implicit = _.map(test.contextProtectedRead(false).implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, [{}]), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to true', function (done) {
            var DATA = [{
                func: 'funcvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            q.resolve().then(function () {
                var test = new SubDocumentTest(SUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var implicit = _.map(test.contextProtectedRead(true).implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });

    describe.skip('contextProtectedWrite', function () {
        it('tests write on key with implicit default canWrite', function (done) {
            done(new Error('Not implemented'));
        });

        it('tests write on key with canWrite set to true', function (done) {
            done(new Error('Not implemented'));
        });

        it('tests write on key with canWrite set to false', function (done) {
            done(new Error('Not implemented'));
        });

        it('tests write on key with canWrite evaluating to false', function (done) {
            done(new Error('Not implemented'));
        });

        it('tests write on key with canWrite evaluating to true', function (done) {
            done(new Error('Not implemented'));
        });
    });
});