'use strict';
const _ = require('lodash');
/* eslint-disable no-param-reassign */
/** @class Log - A class that represents the JSON Documentation. */
class Doc {
  /**
   * Create a Doc util.
   * @param  {Object} source - The JSON documentation source.
   */
  constructor(source) {
    this.docs = source;
    this.cache = { tree: this.toTree() };
  }
  /**
   * Return the JSON object and normalize it if requested.
   * @param  {Boolean} normalize - The truth value on whether the object should be normalized.
   * @return {Object}           - The JSON object.
   */
  toJSON(normalize) {
    return normalize ? Doc.normalize(this.docs) : this.docs;
  }
  /**
   * Transform the JSON object into a tree.
   * @return {Object} - The transformed JSON object.
   */
  toTree() {
    return Doc.unflatten(Doc.normalize(this.docs)).children[0];
  }
  /**
   * Find the directory by name.
   * @param  {string}   name      - The directory name.
   * @param  {Function} callback - The callback function.
   * @return {Object}            - The object containing the directory and the files within.
   */
  findByName(name, callback) {
    const findByName = (parent, n, c) => {
      _.forEach(parent, child => {
        if (child.name === n) c(child);
        if (child.children.length > 0) {
          findByName(child.children, name, c);
        }
      });
    };
    findByName([this.cache.tree], name, callback);
  }
  /**
   * Find the directory by id.
   * @param  {string}   id      - The directory id.
   * @param  {Function} callback - The callback function.
   * @return {Object}            - The object containing the directory and the files within.
   */
  findById(id, callback) {
    const findById = (parent, i, c) => {
      _.forEach(parent, child => {
        if (child.id === i) c(child);
        if (child.children.length > 0) {
          findById(child.children, i, c);
        }
      });
    };
    findById([this.cache.tree], id, callback);
  }
  /**
   * Normalize the source by grouping files into its directory.
   * @param  {Object} source - The JSON documentation source.
   * @return {Object}        - The normalized JSON object.
   */
  static normalize(source) {
    // Transform the source to { path:..., comment:... }.
    const docs = source.comments
    .map(comment => ({
      path: comment.context.file.path.dir.replace(/\\/g, '/'),
      comment,
    }));
    // Transform docs and add files to the same directory.
    let dirs = docs
    .map(comment => ({ path: comment.path, files: [] }));
    dirs = _.uniqWith(dirs, _.isEqual);
    dirs.forEach(dir => {
      docs.forEach(doc => {
        if (doc.path === dir.path) {
          dir.files.push(doc.comment);
        }
      });
    });
    return dirs;
  }
  /**
   * Unflatten the source into a tree structure.
   * @param  {Object} source - The JSON documentation source.
   * @return {Object}        - The unflattened source.
   */
  static unflatten(source) {
    const find = (obj, dir) =>
    obj.children.filter(child => child.name === dir);
    return source.reduce((tree, doc) => {
      doc.path.split('/').reduce((obj, dir) => {
        const result = find(obj, dir);
        if (!_.isEmpty(result)) obj.children.push(result[0]);
        else obj.children.push({ name: dir, children: [], files: doc.files });
        obj.children = _.uniqWith(obj.children, _.isEqual);
        return find(obj, dir)[0];
      }, tree);
      return tree;
    }, { name: 'root', children: [], files: [] });
  }
}
/* eslint-enable no-param-reassign */

module.exports = Doc;
