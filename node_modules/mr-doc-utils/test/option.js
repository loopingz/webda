/* eslint-env node, mocha */
const assert = require('chai').assert;
const Option = require('../src/option');

describe('option', () => {
  it('should return the default options', () => {
    assert.isDefined(Option.defaults);
  });

  it('should return the cli options', () => {
    assert.isDefined(Option.cli);
  });

  it('should return the helper methods', () => {
    assert.isFunction(Option.merge);
    assert.isDefined(Option.merge({}, true));
    assert.isFunction(Option.normalize);
    assert.isDefined(Option.normalize({}));
  });
});
