'use strict';

/* eslint-env node, mocha */
const assert = require('chai').assert;
const Log = require('../src/log');

describe('log', () => {
  let log = undefined;
  beforeEach(done => {
    log = new Log();
    done();
  });
  afterEach(done => {
    log.off();
    done();
  });
  describe('debug()', () => {
    it('should emit a debug event when debug method is called', done => {
      log.on('debug', message => {
        assert.strictEqual(message, 'test');
        done();
      });
      log.debug('test');
    });
  });
  describe('info()', () => {
    it('should emit a info event when info method is called', done => {
      log.on('info', message => {
        assert.strictEqual(message, 'test');
        done();
      });
      log.info('test');
    });
  });
  describe('warn()', () => {
    it('should emit a warn event when warn method is called', done => {
      log.on('warn', message => {
        assert.strictEqual(message, 'test');
        done();
      });
      log.warn('test');
    });
  });
  describe('error()', () => {
    it('should emit a error event when error method is called', done => {
      log.on('error', message => {
        assert.strictEqual(message, 'test');
        done();
      });
      log.error('test');
    });
  });
  describe('formating strings', () => {
    it('should format a string message with util.format syntax', done => {
      log.on('debug', message => {
        assert.strictEqual(message, 'test something');
        done();
      });
      log.debug('test %s', 'something');
    });
    it('should not format a non-string message', done => {
      const expected = { test: 'something' };
      log.on('debug', message => {
        assert.deepEqual(message, expected);
        done();
      });
      log.debug(expected);
    });
  });
});
