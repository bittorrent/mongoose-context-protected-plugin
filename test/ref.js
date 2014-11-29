var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var Test = require('./db/test.model');
var RefTest = require('./db/ref.model');

describe('mongoose-context-protected-plugin ref', function () {
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
                var refData = _.omit(ref.contextProtectedRead(void 0), '_id', '__v');
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
                var refData = _.omit(ref.contextProtectedRead(void 0), '_id', '__v');
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
                var refData = _.omit(ref.contextProtectedRead(void 0), '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, {
                    implicit: {}
                }), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to false', function (done) {
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
                var refData = _.omit(ref.contextProtectedRead(false), '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, {
                    implicit: {}
                }), 'read data must match model initialization data');
            }).nodeify(done);
        });

        it('tests read on key with canRead evaluating to true', function (done) {
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
                var refData = _.omit(ref.contextProtectedRead(true), '_id', '__v');
                refData.implicit = _.omit(refData.implicit, '_id', '__v');
                debug('%o', refData);
                assert(_.isEqual(refData, REF_DATA), 'read data must match model initialization data');
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