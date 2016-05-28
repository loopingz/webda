'use strict';
/* eslint-disable prefer-arrow-callback */
const Log = require('./log');
const log = new Log();
const Vinyl = require('vinyl');
const Through = require('through2');
const Option = require('./option');
const Reference = require('./reference');
class Output {
  constructor(options) {
    this.options = options;
    this.plugins = [];
  }
  use(plugin) {
    this.plugins.push(plugin);
    return this;
  }
  toStream() {
    const opt = this.options;
    return Output
    .toStream(this.plugins[0](opt), this.plugins[1](opt), opt);
  }
  static handler(buffer, parser, compiler, options) {
    const file = options.compiler.file;
    return function (callback) {
      Output.format(buffer, parser, compiler, options).forEach(function (f) {
        if (file.format === 'json' || file.format === 'md') {
          this.push(new Vinyl({
            path: `${file.name}.${file.format}`,
            contents: new Buffer(f),
          }));
        } else if (file.format === 'html') {
          this.push(f);
        }
      }.bind(this));
      callback();
    };
  }
  static format(buffer, parser, compiler, options) {
    const files = Reference.generate(buffer, options);
    // DEBUG: Files
    log.debug(Log.color.blue('Number of files: '), files.length);
    const format = options.compiler.file.format;
    if (format === 'md' || format === 'json') {
      return files
      .map(file => parser.parse(file))
      .map(file => compiler.compile(file));
    }
    return buffer;
  }
  static toBuffer(buffer) {
    return (file, enc, callback) => {
      buffer.push(file);
      callback();
    };
  }
  static toStream(parser, compiler, options) {
    const buffer = [];
    return Through.obj(Output.toBuffer(buffer),
      Output.handler(buffer, parser, compiler, Option.merge(options)));
  }
}

module.exports = Output;
