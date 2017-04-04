"use strict";
const Writable = require('stream').Writable;
const _extend = require('util')._extend;
const CoreModel = require('../models/coremodel');
const acceptLanguage = require('accept-language');

class Context {

  /**
   * @private
   * Used in case of Buffer response ( like Lambda )
   */
  _write(chunk, enc, next) {
    if (this._body === undefined) {
      this._body = [];
    }
    this._body.push(chunk);
    next();
    return true;
  }

  /**
   * Write data to the client
   *
   * @param output If it is an object it will be serializeb with toPublicJSON, if it is a String it will be appended to the result, if it is a buffer it will replace the result
   * @param ...args any arguments to pass to the toPublicJSON method
   */
  write(output) {
    if (typeof(output) == "object" && !(output instanceof Buffer)) {
      this._headers['Content-type'] = 'application/json';
      CoreModel.__ctx = this;
      if (output instanceof CoreModel) {
        this._body = JSON.stringify(output);
      } else {
        this._body = this._webda.toPublicJSON(output);
      }
      CoreModel.__ctx = undefined;
      return;
    } else if (typeof(output) == "string") {
      if (this._body == undefined) {
        this._body = '';
      }
      this._body += output;
      return;
    } else {
      this._body = output;
    }
  }


  /**
   * Set a header value
   *
   * @param {String} header name
   * @param {String} value
   */
  setHeader(header, value) {
    this._headers[header] = value;
  }

  /**
   * Write the http return code and some headers
   * Those headers are not flushed yet so can still be overwritten
   *
   * @param {Number} httpCode to return to the client
   * @param {Object} headers to add to the response
   */
  writeHead(httpCode, headers) {
    _extend(this._headers, headers);
    if (httpCode !== undefined) {
      this.statusCode = httpCode;
    }
  }

  /**
   * For compatibility reason
   *
   * @todo Implement the serialization
   * Not yet handle by the Webda framework
   */
  cookie(param, value) {
    /** @ignore */
    if (this._cookie === undefined) {
      this._cookie = {};
    }
    this._cookie[param] = value;
  }

  /**
   * Flush the request
   *
   * @emits 'finish' event
   * @throws Error if the request was already ended
   */
  end() {
    /** @ignore */
    if (this._ended) {
      throw Error("Already ended");
    }
    this._ended = true;
    if (this._buffered && this._stream._body !== undefined) {
      this._body = Buffer.concat(this._stream._body);
    }
    if (!this._flushHeaders) {
      this._flushHeaders = true;
      if (this._body !== undefined && this.statusCode == 204) {
        this.statusCode = 200;
      }
      this._webda.flushHeaders(this);
    }
    this._webda.flush(this);
  }

  /**
   * Get a service from webda
   *
   * @see Webda
   * @param {String} name of the service
   */
  getService(name) {
    return this._webda.getService(name);
  }

  /**
   * Get the current user from session
   */
  getCurrentUser() {
    let uid = this.getCurrentUserId();
    return this.getService('Users').get(uid);
  }

  /**
   * Get the current user id from session
   */
  getCurrentUserId() {
    if (this.session) {
      return this.session.getUserId();
    }
    return undefined;
  }

  /**
   * Get the request locale if found
   */
  getLocale() {
    var locales = this._webda.getLocales();
    acceptLanguage.languages(locales);
    if (this.headers['Accept-Language']) {
      return acceptLanguage.get(this.headers['Accept-Language']);
    }
    return locales[0];
  }

  /**
   * @ignore
   * Used by Webda framework to set the current route
   */
  setRoute(route) {
    this._route = route;
    this._params = _extend(this._params, route.params);
    // For retro compatibilify
    this._params = _extend(this._params, this.query);
    if (this._route && this._route._http && this._route._http.headers) {
      this.headers = this._route._http.headers;
    }
  }

  /**
   * @param executor {object} Set the current executor for this context
   */
  setExecutor(executor) {
    this._executor = executor;
  }

  /**
   * @ignore
   * Used for compatibility with express module
   */
  logIn() {

  }

  /**
   * @ignore
   * Used by Webda framework to set the body, session and output stream if known
   */
  constructor(webda, body, session, stream, files) {
    this._webda = webda;
    this.session = session;
    if (session === undefined) {
      this.session = webda.getNewSession();
    }
    this.body = body;
    this.files = files;
    this._headers = {};
    this._flushHeaders = false;
    this._body = undefined;
    this.statusCode = 204;
    this._ended = false;
    this._stream = stream;
    this._buffered = false;
    this._params = {};
    this.headers = {};
    if (stream === undefined) {
      this._stream = new Writable();
      this._stream._body = [];
      this._stream._write = this._write;
    }
    this._stream.on('pipe', (src) => {
      this._flushHeaders = true;
      this._buffered = true;
      this._webda.flushHeaders(this);
    });
  }
}

module.exports = Context;