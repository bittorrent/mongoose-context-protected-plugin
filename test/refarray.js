'use strict';

var mongoose = require('mongoose');
var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var Test = require('./db/test.model');
var RefTest = require('./db/refarray.model');

describe('mongoose-context-protected-plugin refarray', function () {
    // refs can be populated, and thus read from,
    // but they cannot be written to in the same fashion
    // as subdocuments, so we only need read tests
    describe('contextProtectedRead', function () {
        it('tests read on key with unpopulated implicit default canRead', function (done) {
            var TEST_DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated implicit default canRead', function (done) {
            var TEST_DATA = {
                implicit: 'implicitvalue'
            };
            var REF_DATA = {
                implicit: [TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                ref.populate('implicit', defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead set to true', function (done) {
            var TEST_DATA = {
                truthy: 'truthyvalue'
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead set to true', function (done) {
            var TEST_DATA = {
                truthy: 'truthyvalue'
            };
            var REF_DATA = {
                implicit: [TEST_DATA]
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                var defer = q.defer();
                ref.populate('implicit', defer.makeNodeResolver());
                return defer.promise;
            }).then(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead set to false', function (done) {
            var TEST_DATA = {
                falsy: 'falsyvalue'
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                return ref.contextProtectedRead(void 0);
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead set to false', function (done) {
            var TEST_DATA = {
                falsy: 'falsyvalue'
            };
            var REF_DATA = {
                implicit: [{}]
            };
            q.resolve().then(function () {
                var test = new Test(TEST_DATA);
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
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
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead returning false', function (done) {
            q.resolve().then(function () {
                var test = new Test({
                    func: 'funcvalue'
                });
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                return ref.contextProtectedRead(false);
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead returning false', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: [{}]
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
                return ref.contextProtectedRead(false);
            }).then(function (data) {
                debug('data %o', data);
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead returning true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
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
                return ref.contextProtectedRead(true);
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead returning true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: [TEST_DATA]
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
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead resolving to false', function (done) {
            q.resolve().then(function () {
                var test = new Test({
                    func: 'funcvalue'
                });
                var defer = q.defer();
                test.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (test) {
                var ref = new RefTest({
                    implicit: [test]
                });
                var defer = q.defer();
                ref.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (ref) {
                return ref.contextProtectedRead(q.resolve(false));
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead resolving to false', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: [{}]
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
                return ref.contextProtectedRead(q.resolve(false));
            }).then(function (data) {
                debug('data %o', data);
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with unpopulated canRead resolving to true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
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
                return ref.contextProtectedRead(q.resolve(true));
            }).then(function (data) {
                assert(_.isArray(data.implicit), 'read data must contain an implicit array');
                assert(data.implicit.length === 1, 'read data implicit value must have one element');
                assert(data.implicit[0] instanceof mongoose.Types.ObjectId, 'read data implicit element must be an ObjectId');
            }).nodeify(done);
        });

        it('tests read on key with populated canRead resolving to true', function (done) {
            var TEST_DATA = {
                func: 'funcvalue'
            };
            var REF_DATA = {
                implicit: [TEST_DATA]
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
                var refData = _.pick(data, 'implicit');
                refData.implicit = _.map(refData.implicit, function (value) {
                    return _.omit(value, '_id', '__v');
                });
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
            }).nodeify(done);
        });
    });
});