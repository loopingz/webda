"use strict";
const Writable = require("stream").Writable;
import {
  _extend,
  Core as Webda,
  Executor,
  SecureCookie,
  CoreModel,
  Store,
  User,
  Service
} from "../index";
const acceptLanguage = require("accept-language");

class ClientInfo extends Map<string, any> {
  ip: string;
  userAgent: string;
  locale: string;
  referer: string;
}

class Context extends Map<string, any> {
  clientInfo: ClientInfo;
  _body: any;
  _headers: Map<string, string>;
  _webda: Webda;
  statusCode: number;
  _cookie: Map<string, string>;
  headers: Map<string, string>;
  _route: any;
  _buffered: boolean;
  session: SecureCookie;
  _ended: Promise<any> = undefined;
  _stream: any;
  _promises: Promise<any>[];
  _executor: Executor;
  _flushHeaders: boolean;
  body: any;
  _params: any;
  files: any[];
  query: any;
  static current;

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

  static get() {
    return this.current;
  }

  /**
   * Write data to the client
   *
   * @param output If it is an object it will be serializeb with toPublicJSON, if it is a String it will be appended to the result, if it is a buffer it will replace the result
   * @param ...args any arguments to pass to the toPublicJSON method
   */
  write(output) {
    if (typeof output === "object" && !(output instanceof Buffer)) {
      this._headers["Content-type"] = "application/json";
      // TODO Remove CoreModel.__ctx in 0.11
      CoreModel.__ctx = Context.current = this;
      try {
        this._body = JSON.stringify(output);
      } finally {
        CoreModel.__ctx = Context.current = undefined;
      }
      return;
    } else if (typeof output == "string") {
      if (this._body == undefined) {
        this._body = "";
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

  redirect(url: string) {
    this.writeHead(302, { Location: url });
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
      this._cookie = new Map();
    }
    this._cookie[param] = value;
  }

  addAsyncRequest(promise) {
    this._promises.push(promise);
  }

  isEnded() {
    return this._ended;
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
      return this._ended;
    }
    this._ended = Promise.all(this._promises).then(() => {
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
      return Promise.resolve();
    });
    return this._ended;
  }

  /**
   * Get a service from webda
   *
   * @see Webda
   * @param {String} name of the service
   */
  getService(name): Service {
    return this._webda.getService(name);
  }

  /**
   * Get the HTTP stream to output raw data
   * @returns {*}
   */
  getStream() {
    return this._stream;
  }

  /**
   * Get the current user from session
   */
  async getCurrentUser(): Promise<User> {
    if (!this.getCurrentUserId()) {
      return undefined;
    }
    return (<Store<User>>this._webda.getService("Users")).get(
      this.getCurrentUserId()
    );
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
   * Return the webda
   */
  getWebda() {
    return this._webda;
  }

  /**
   * Get the request locale if found
   */
  getLocale() {
    let locales = this._webda.getLocales();
    acceptLanguage.languages(locales);
    if (this.headers["Accept-Language"]) {
      return acceptLanguage.get(this.headers["Accept-Language"]);
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
  logIn() {}

  /**
   * @ignore
   * Used by Webda framework to set the body, session and output stream if known
   */
  constructor(webda, body, session, stream = undefined, files = []) {
    super();
    this.clientInfo = new ClientInfo();
    this._webda = webda;
    this.session = session;
    if (session === undefined) {
      this.session = webda.getNewSession();
    }
    this.body = body;
    this.files = files;
    this._promises = [];
    this._headers = new Map();
    this._flushHeaders = false;
    this._body = undefined;
    this.statusCode = 204;
    this._stream = stream;
    this._buffered = false;
    this._params = {};
    this.headers = new Map();
    if (stream === undefined) {
      this._stream = new Writable();
      this._stream._body = [];
      this._stream._write = this._write;
    }
  }

  init() {
    this._stream.on("pipe", () => {
      this._flushHeaders = true;
      this._buffered = true;
      this._webda.flushHeaders(this);
    });
  }
}

export { Context, ClientInfo };
