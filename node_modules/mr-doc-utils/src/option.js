'use strict';
const Path = require('path');
const _ = require('lodash');
const chalk = require('chalk');

class Option {
  /**
   * Get the default options.
   * @return {Object}         - The merged options.
   */
  static get defaults() {
    return {
      parser: {
        language: 'javascript',
        engine: 'espree',
        version: 6,
      },
      compiler: {
        file: {
          name: 'docs',
          format: 'html',
        },
        template: {
          path: undefined,
          engine: 'jade',
        },
      },
      theme: {
        name: 'mr-doc-theme-default',
        path: undefined,
      },
      log: {
        level: 'info, warn',
        silent: false,
      },
      project: {
        name: '#',
        url: {
          home: '#',
          repo: '#',
        },
      },
    };
  }
  /**
   * Merge the CLI options.
   * @param  {Object} options - The yarg options to merge.
   * @param {Boolean} normalize - Determine whether the options should be normalized.
   * @return {Object}         - The merged options.
   */
  static merge(options, normalize) {
    return _.merge(Option.defaults, normalize === true ? Option.normalize(options) : options);
  }
  /**
   * Normalize CLI options.
   * @param  {Object} options - The yarg options to merge.
   * @return {Object}         - The normalized options.
   */
  static normalize(options) {
    return {
      mrdoc: {
        source: options.source || options.s,
        output: options.output || options.o,
        cwd: options.cwd,
        reference: (() => {
          const ref = options.reference || options.r;
          if (ref === true || ref === 'true') return ref;
          return false;
        })(),
        watch: options.watch || options.w,
      },
      compiler: {
        file: {
          name: options.formatName,
          format: options.format,
        },
        template: {
          path: options.template || options.b,
          engine: options.compilerEngine,
        },
      },
      parser: {
        language: options.parserLang,
        engine: options.parserEngine,
        version: options.parserVersion,
      },
      theme: {
        name: (() => {
          if (_.isString(options.theme)) {
            if (options.theme.indexOf(Path.sep) > -1) {
              return 'Custom theme';
            }
          }
          return 'mr-doc-theme-default';
        })(),
        path: (() => {
          if (_.isString(options.theme)) {
            if (options.theme.indexOf(Path.sep) > -1) {
              return options.theme;
            }
          }
          return undefined;
        })(),
      },
    };
  }
  /**
   * Get the CLI options.
   * @static
   * @return {Object} - The CLI options.
   */
  static get cli() {
    return {
      version: {
        alias: 'v',
        type: 'boolean',
        describe: chalk.gray('Print the global version.'),
      },
      mrdocrc: {
        type: 'string',
        default: Path.join(process.cwd(), '.mrdocrc'),
        describe: chalk.gray(
          `Set the path to .mrdocrc.
          This will set the cwd to the rc's directory as well.`),
      },
      cwd: {
        type: 'string',
        default: Path.normalize(process.cwd()),
        describe: chalk.gray('Set the cwd.'),
      },
      'compiler-engine': {
        type: 'string',
        default: Option.defaults.compiler.template.format,
        describe: chalk.gray('Set the compiler engine specific to the html output.'),
      },
      source: {
        alias: 's',
        type: 'string',
        describe: chalk.gray(
          'Set the source directory(-ies). Note: Glob notation is allowed.'),
      },
      output: {
        alias: 'o',
        type: 'string',
        default: Path.join(process.cwd(), 'docs/'),
        describe: chalk.gray('Set the output directory.'),
      },
      format: {
        alias: 'f',
        type: 'string',
        default: Option.defaults.compiler.file.format,
        describe: chalk.gray('Set the output format. Formats: html, json, md.'),
      },
      'format-name': {
        type: 'string',
        default: Option.defaults.compiler.file.name,
        describe: chalk.gray('Set the output name. Note: Only in json and md format.'),
      },
      template: {
        alias: 'b',
        type: 'string',
        describe: chalk.gray('Set the template file to use.'),
      },
      theme: {
        alias: 't',
        type: 'string',
        default: Option.defaults.theme.name,
        describe: chalk.gray('Set the theme to use. Note: Name or path is allowed.'),
      },
      'parser-lang': {
        type: 'string',
        default: Option.defaults.parser.language,
        describe: chalk.gray(
          'Set the language of the sources. Note: This is automatically detected.'),
      },
      'parser-engine': {
        alias: 'e',
        type: 'string',
        default: Option.defaults.parser.engine,
        describe: chalk.gray(
          'Set the parser engine (if applicable). i.e. espree, babylon, etc.'),
      },
      'parser-version': {
        alias: 'y',
        type: 'number',
        default: Option.defaults.parser.version,
        describe: chalk.gray('Set the parser version. i.e. \'6\'.'),
      },
      'project-name': {
        type: 'string',
        default: Option.defaults.project.name,
        describe: chalk.gray('Set the project name.'),
      },
      'project-homepage': {
        type: 'string',
        default: Option.defaults.project.url.home,
        describe: chalk.gray('Set the project homepage url.'),
      },
      'project-repo': {
        type: 'string',
        default: Option.defaults.project.url.repo,
        describe: chalk.gray('Set the project url.'),
      },
      reference: {
        alias: 'r',
        type: 'boolean',
        default: true,
        describe: chalk.gray('Allow references of other files within each file.'),
      },
      log: {
        alias: 'l',
        type: 'string',
        describe: chalk.gray(`Set the log level. Levels: ${[
          chalk.green('debug'),
          chalk.blue('info'),
          chalk.yellow('warn'),
          chalk.red('error'),
          chalk.gray('silent'),
        ].join(', ')}`),
        required: false,
        default: Option.defaults.log.level,
      },
      watch: {
        alias: 'w',
        type: 'boolean',
        default: false,
        describe: chalk.gray('Allow changes and additions to be watched.'),
      },
    };
  }
}

module.exports = Option;
