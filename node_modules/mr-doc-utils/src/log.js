'use strict';

const Util = require('util');
const chalk = require('chalk');
const sparkles = require('sparkles');
const _ = require('lodash');

/**
 * Format the messagse
 * @param  {*} message - The message to format.
 * @return {*}         - The formatted message.
 */
function format(message) {
  return _.isString(message) ? Util.format.apply(null, arguments) : message;
}
/**
 * Create a logger for the current namespace.
 * @ignore
 * @return {Function} - The logger function that emits the message.
 */
const logger = level => function emit() {
  this.emit(level, format.apply(null, arguments));
};

/** @class Log - A class that represents a logger. */
class Log {
  /**
   * Create a Log util.
   * @param  {String} namespace - The namespace for the logger.
   */
  constructor(namespace) {
    this.event = sparkles(_.isEmpty(namespace) ? namespace : 'mrdoc');
    Log.levels.forEach(level => { this.event[level] = logger(level); });
  }
  /**
   * Call the debug logger.
   */
  debug() {
    this.event.debug.apply(this.event, arguments);
  }
  /**
   * Call the debug logger.
   */
  info() {
    this.event.info.apply(this.event, arguments);
  }
  /**
   * Call the debug logger.
   */
  warn() {
    this.event.warn.apply(this.event, arguments);
  }
  /**
   * Call the debug logger.
   */
  error() {
    this.event.error.apply(this.event, arguments);
  }
  /**
   * Catch the event based on log level.
   */
  on() {
    this.event.on.apply(this.event, arguments);
  }
  /**
   * Unsubscribe to the current namespace.
   */
  off() {
    this.event.remove();
  }
  /**
   * Get the available levels.
   * @static
   * @return {Array<string>} - The available levels in Log.
   */
  static get levels() {
    return ['debug', 'info', 'warn', 'error'];
  }
  /**
   * Get an instance of Chalk.
   * @return {Chalk} - An instance of Chalk.
   */
  static get color() {
    return chalk;
  }
}

module.exports = Log;
