'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');
var debug = require('debug')('mongoose-context-protected-plugin:test');

var DefaultsFalse = require('./db/defaults.false.model');
var DefaultsTrue = require('./db/defaults.true.model');

describe('mongoose-context-protected-plugin defaults', function () {
    describe('contextProtectedRead', function () {
        it('tests read on key with implicit default canRead set to true', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var doc = new DefaultsTrue(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                debug('saved doc %o', doc);
                return doc.contextProtectedRead(void 0);
            }).then(function (data) {
                var docData = _.omit(data, '_id', '__v');
                debug('%o', docData);
                assert(_.isEqual(docData, DATA), 'read data must be empty');
            }).fail(function (err) {
                debug('err - %o', err);
                throw err;
            }).nodeify(done);
        });
        it('tests read on key with implicit default canRead set to false', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var doc = new DefaultsFalse(DATA);
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                debug('saved doc %o', doc);
                return doc.contextProtectedRead(void 0);
            }).then(function (data) {
                var docData = _.omit(data, '_id', '__v');
                debug('%o', docData);
                assert(_.isEqual(docData, {}), 'read data must be empty');
            }).fail(function (err) {
                debug('err - %o', err);
                throw err;
            }).nodeify(done);
        });
    });
    describe('contextProtectedWrite', function () {
        it('tests write on key with implicit default canWrite set to true', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var doc = new DefaultsTrue();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(void 0, DATA);
            }).then(function (doc) {
                var docData = _.omit(doc.toObject(), '_id', '__v');
                debug('%o', docData);
                assert(_.isEqual(docData, DATA), 'model data must match write data');
            }).nodeify(done);
        });
        it('tests write on key with implicit default canWrite set to false', function (done) {
            var DATA = {
                implicit: 'implicitvalue'
            };
            q.resolve().then(function () {
                var doc = new DefaultsFalse();
                var defer = q.defer();
                doc.save(defer.makeNodeResolver());
                return defer.promise;
            }).spread(function (doc) {
                return doc.contextProtectedWrite(void 0, DATA);
            }).then(function () {
                assert(false, 'expected insufficient permission assertion error');
            }, function (err) {
                assert(err.name === 'AssertionError', 'expected an assertion error');
                assert(err.message === 'insufficient permission', 'expected insufficient permission');
            }).nodeify(done);
        });
    });
});