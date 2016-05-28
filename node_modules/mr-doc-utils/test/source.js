/* eslint-env node, mocha */
const assert = require('chai').assert;
const Source = require('../src/source');
const Path = require('path');

describe('source', () => {
  const options = { mrdoc: { cwd: process.cwd() }, parser: { language: 'javascript' } };
  describe('normalizePath()', () => {
    it('should normalize path: "{cwd}/src" to ["{cwd}/src/*.js"]', () => {
      assert.deepEqual(Source.normalizePath('./src', options),
      [`${Path.join(process.cwd(), './src/')}*.js`]);
    });
  });
});
