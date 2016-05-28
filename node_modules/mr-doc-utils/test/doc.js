/* eslint-env node, mocha */
const assert = require('chai').assert;
const Doc = require('../src/doc');
const fixture = require('./fixtures/docs.json');

describe('doc', () => {
  const doc = new Doc(fixture);
  describe('toJSON()', () => {
    it('should return the JSON object', () => {
      assert.deepEqual(doc.toJSON(), fixture);
    });
    it('should return a normalized JSON object', () => {
      assert.notDeepEqual(doc.toJSON(true), fixture);
    });
  });
  describe('toTree()', () => {
    it('should return a tree object', () => {
      assert.notDeepEqual(doc.toTree(), fixture);
    });
  });
});
