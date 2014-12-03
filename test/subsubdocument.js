'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var SubSubDocumentTest = require('./db/subsubdocument.model');

describe('mongoose-context-protected-plugin subdocument', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var DATA = [{
                implicit: 'implicitvalue'
            }];
            var SUBDOCUMENT_TEST_DATA = {
                implicit: DATA
            };
            var SUBSUBDOCUMENT_TEST_DATA = {
                truthy: [SUBDOCUMENT_TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new SubSubDocumentTest(SUBSUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                debug('test %', test.truthy);
                var readData = test.contextProtectedRead(void 0);
                assert(readData.truthy.length === 1, 'expected a single truthy element');
                var implicit = _.map(readData.truthy[0].implicit, function (val) {
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
            var SUBSUBDOCUMENT_TEST_DATA = {
                truthy: [SUBDOCUMENT_TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new SubSubDocumentTest(SUBSUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                debug('test %', test.truthy);
                var readData = test.contextProtectedRead(void 0);
                assert(readData.truthy.length === 1, 'expected a single truthy element');
                var implicit = _.map(readData.truthy[0].implicit, function (val) {
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
            var SUBSUBDOCUMENT_TEST_DATA = {
                truthy: [SUBDOCUMENT_TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new SubSubDocumentTest(SUBSUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var readData = test.contextProtectedRead(void 0);
                debug('contextProtectedRead %o', readData);
                assert(readData.truthy.length === 1, 'expected a single truthy element');
                var implicit = _.map(readData.truthy[0].implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                debug('implicit %o', implicit);
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
            var SUBSUBDOCUMENT_TEST_DATA = {
                truthy: [SUBDOCUMENT_TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new SubSubDocumentTest(SUBSUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var readData = test.contextProtectedRead(false);
                debug('contextProtectedRead %o', readData);
                assert(readData.truthy.length === 1, 'expected a single truthy element');
                var implicit = _.map(readData.truthy[0].implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                debug('implicit %o', implicit);
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
            var SUBSUBDOCUMENT_TEST_DATA = {
                truthy: [SUBDOCUMENT_TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new SubSubDocumentTest(SUBSUBDOCUMENT_TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                debug('test %', test.truthy);
                var readData = test.contextProtectedRead(true);
                assert(readData.truthy.length === 1, 'expected a single truthy element');
                var implicit = _.map(readData.truthy[0].implicit, function (val) {
                    return _.omit(val, '_id', '__v');
                });
                assert(_.isEqual(implicit, DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });

    // describe('contextProtectedWrite', function () {
    //     it('tests write on key with implicit default canWrite', function (done) {
    //         var DATA = [{
    //             implicit: 'implicitvalue'
    //         }];
    //         q.resolve().then(function () {
    //             var test = new SubDocumentTest();
    //             var defer = q.defer();
    //             test.save(defer.makeNodeResolver());
    //             return defer.promise;
    //         }).spread(function (test) {
    //             return test.contextProtectedWrite(void 0, {
    //                 truthy: DATA
    //             });
    //         }).then(function () {
    //             assert(false, 'expected insufficient permission assertion error');
    //         }, function (err) {
    //             assert(err.name === 'AssertionError', 'expected an assertion error');
    //             assert(err.message === 'insufficient permission', 'expected insufficient permission');
    //         }).nodeify(done);
    //     });

    //     it('tests write on key with canWrite set to true', function (done) {
    //         var DATA = [{
    //             truthy: 'truthyvalue'
    //         }];
    //         q.resolve().then(function () {
    //             var test = new SubDocumentTest();
    //             var defer = q.defer();
    //             test.save(defer.makeNodeResolver());
    //             return defer.promise;
    //         }).spread(function (test) {
    //             return test.contextProtectedWrite(void 0, {
    //                 truthy: DATA
    //             });
    //         }).then(function (test) {
    //             var testData = _.map(test.toObject().truthy, function (subdoc) {
    //                 return _.omit(subdoc, '_id', '__v');
    //             });
    //             debug('%o %o', testData, DATA);
    //             assert(_.isEqual(testData, DATA), 'model data must match write data');
    //         }).nodeify(done);
    //     });

    //     it('tests write on key with canWrite set to false', function (done) {
    //         var DATA = [{
    //             falsy: 'falsyvalue'
    //         }];
    //         q.resolve().then(function () {
    //             var test = new SubDocumentTest();
    //             var defer = q.defer();
    //             test.save(defer.makeNodeResolver());
    //             return defer.promise;
    //         }).spread(function (test) {
    //             return test.contextProtectedWrite(void 0, {
    //                 truthy: DATA
    //             });
    //         }).then(function () {
    //             assert(false, 'expected insufficient permission assertion error');
    //         }, function (err) {
    //             assert(err.name === 'AssertionError', 'expected an assertion error');
    //             assert(err.message === 'insufficient permission', 'expected insufficient permission');
    //         }).nodeify(done);
    //     });

    //     it('tests write on key with canWrite evaluating to false', function (done) {
    //         var DATA = [{
    //             func: 'funcvalue'
    //         }];
    //         q.resolve().then(function () {
    //             var test = new SubDocumentTest();
    //             var defer = q.defer();
    //             test.save(defer.makeNodeResolver());
    //             return defer.promise;
    //         }).spread(function (test) {
    //             return test.contextProtectedWrite(false, {
    //                 truthy: DATA
    //             });
    //         }).then(function () {
    //             assert(false, 'expected insufficient permission assertion error');
    //         }, function (err) {
    //             assert(err.name === 'AssertionError', 'expected an assertion error');
    //             assert(err.message === 'insufficient permission', 'expected insufficient permission');
    //         }).nodeify(done);
    //     });

    //     it('tests write on key with canWrite evaluating to true', function (done) {
    //         var DATA = [{
    //             func: 'funcvalue'
    //         }];
    //         q.resolve().then(function () {
    //             var test = new SubDocumentTest();
    //             var defer = q.defer();
    //             test.save(defer.makeNodeResolver());
    //             return defer.promise;
    //         }).spread(function (test) {
    //             return test.contextProtectedWrite(true, {
    //                 truthy: DATA
    //             });
    //         }).then(function (test) {
    //             var testData = _.map(test.toObject().truthy, function (subdoc) {
    //                 return _.omit(subdoc, '_id', '__v');
    //             });
    //             debug('%o %o', testData, DATA);
    //             assert(_.isEqual(testData, DATA), 'model data must match write data');
    //         }).nodeify(done);
    //     });
    // });
});