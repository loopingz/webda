'use strict';
const Extension = require('./extension');
const FS = require('fs-extra');
const _ = require('lodash');
const Path = require('path');
const isGlob = require('is-glob');

class Source {
  static generate(file) {
    return {
      id: file.id,
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      source: file.source,
      comments: file.comments,
    };
  }
  static normalizePath(source, options) {
    return source.split(',')
    .map(path => path.trim())
    .map(path => {
      // Check if the path is not in glob pattern.
      if (!isGlob(path)) {
        // Assume that Glob is used.
        let isFile = false;
        // Make sure the path is resolved.
        let str = Path.resolve(options.mrdoc.cwd, path).replace('/', Path.sep);
        // Check if the path is a file or directory.
        if (_.isEmpty(Path.parse(path).ext)) {
          // Check if the path has a '/' at the end.
          str = str[str.length - 1] === Path.sep ?
          str : `${str}${Path.sep}`;
        } else isFile = true;
        // Make sure the file or directory exists;
        if (FS.existsSync(str)) {
          if (!isFile) {
            // Check if the directory has sub-directories.
            const hasSubDirs = FS.readdirSync(str)
            .filter(file =>
              FS.statSync(Path.join(str, file)).isDirectory()).length > 1;
            // Get the file extension.
            const extension = Extension.find(options.parser.language);
            // Set the glob pattern based on 'hasSubDirs'.
            str = hasSubDirs ?
            `${str}**${Path.sep}*${extension}` : `${str}*${extension}`;
          }
        } else return null;
        return str;
      }
      return path;
    });
  }
}

module.exports = Source;
