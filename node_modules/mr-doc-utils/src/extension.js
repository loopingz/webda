'use strict';

class Extension {
  static find(language) {
    return Extension.extensions()[language];
  }
  static extensions() {
    return {
      js: '.js',
      javascript: '.js',
      json: '.json',
      html: '.html',
    };
  }
}

module.exports = Extension;
