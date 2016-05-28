'use strict';

const FS = require('fs-extra');
const _ = require('lodash');
const Path = require('path');
const Source = require('./source');
const ShortID = require('shortid');

class Reference {
  static generate(files, options) {
    // Process the files.
    const result = files
    .map(file => Reference.processFile(file));
    // Create references for each file.
    const references = result
    .map(file => Reference.createReference(file));
    // Process the references and attach it to each file.
    return options.mrdoc.reference ?
    result
      .map(file => Reference.processReference(file, references)) :
    result
      .map(file => Reference.processFile(file));
  }
  static processFile(file) {
    return Source.generate({
      id: ShortID.generate(),
      cwd: file.cwd,
      base: file.base.replace(file.cwd + Path.sep, ''),
      path: file.path,
      source: FS.readFileSync(file.path, 'utf8'),
      comments: undefined,
    });
  }
  static createReference(file) {
    return Source.generate(file);
  }
  static processReference(file, references) {
    return _.merge(file, {
      ref: references.map(ref => ({ [ref.id]: _.omit(ref, 'id') })),
    });
  }
}

module.exports = Reference;
