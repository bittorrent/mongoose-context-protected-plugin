'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var Test = require('./db/test.model');
var RefTest = require('./db/ref.model');

describe('mongoose-context-protected-plugin ref', function () {
    // refs can be populated, and thus read from,
    // but they cannot be written to in the same fashion
    // as subdocuments, so we only need read tests
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead', function (done) {
            var TEST_DATA = {
                implicit: 'implicitvalue'
            };
            var REF_DATA = {
                implicit: TEST_DATA
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to true', function (done) {
            var TEST_DATA = {
                truthy: 'truthyvalue'
            };
            var REF_DATA = {
                implicit: TEST_DATA
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead set to false', function (done) {
            q.resolve().then(function () {
                var test = new Test({
                    falsy: 'falsyvalue'
                });
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, {
                    implicit: {}
                }), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning false', function (done) {
            q.resolve().then(function () {
                var test = new Test({
                    func: 'funcvalue'
                });
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, {
                    implicit: {}
                }), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead returning true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: TEST_DATA
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(true);
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to false', function (done) {
            q.resolve().then(function () {
                var test = new Test({
                    func: 'funcvalue'
                });
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(q.resolve(false));
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, {
                    implicit: {}
                }), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead resolving to true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: TEST_DATA
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: test
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                RefTest.findOne(ref).populate('implicit').exec(defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(q.resolve(true));
            }).then(function (data) {
                var refData = _.omit(data, '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });
});