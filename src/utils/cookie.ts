import { _extend } from '../core';
const crypto = require('crypto');

function encrypt(algo, pass, text) {
  let cipher = crypto.createCipher(algo, pass);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(algo, pass, text) {
  let decipher = crypto.createDecipher(algo, pass);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Object that handle the session
 *
 * To get stateless server the session is encrypted inside a cookie, so you should not store large amount of data in it
 * If you need big session then i would suggest to use a Memcache store with the user.uuid as a key
 *
 * It is part of the core framework implementation, you should not rely on any method of this object, as the implementation can change if needed
 * An object session is exposed by the framework, so use this one ( for now it is a SecureCookie.getProxy() but can evolve )
 *
 * The object use Object.observe if available or try Proxy in other case, so old JS VM won't run it
 */
class SecureCookie {
  _algo: string;
  _secret: string;
  _changed: boolean;
  _options: any;
  _raw: string;
  userId: string;
  identUsed: string;

  /** @ignore */
  constructor(options, data) {

    this._algo = "aes-256-ctr";
    this._secret = options.secret;
    this._options = options;
    this._changed = false;
    if (data === undefined || data === '') {
      return;
    }
    if (typeof(data) === "string") {
      this._raw = data;
      try {
        _extend(this, this._decrypt(data));
      } catch (err) {
        // Reinit the session as we cannot read the cookie
        // Might pass webda to get more context
        console.log("CANT DECRYPT:", data);
        this._changed = true;
      }
    } else {
      _extend(this, data);
    }
  }

  getProxy() {
    // Should use Proxy if available
    if (Proxy != undefined) {
      // Proxy implementation
      return new Proxy(this, {
        set: (obj, prop, value) => {
          obj[prop] = value;
          if (prop !== "_changed") {
            this._changed = true;
          }
          return true;
        }
      });
    }
  }

  login(userId, identUsed) {
    this.userId = userId;
    this.identUsed = identUsed;
  }

  isLogged() {
    return this.userId !== undefined;
  }

  destroy() {
    for (let prop in this) {
      if (prop[0] === "_") {
        continue;
      }
      delete this[prop];
    }
    this._changed = true;
  }

  getIdentUsed() {
    return this.identUsed;
  }

  getUserId() {
    return this.userId;
  }

  logout() {
    delete this.userId;
  }

  _decrypt(data) {
    try {
      return JSON.parse(decrypt(this._algo, this._secret, data));
    } catch (err) {
      throw new Error("Bad SecureCookie");
    }
  }

  toJSON() {
    let data : any = {};
    for (let prop in this) {
      if (prop[0] === "_") {
        continue;
      }
      data[prop] = this[prop];
    }
    return data;
  }

  save() {
    if (this.needSave()) {
      return encrypt(this._algo, this._secret, JSON.stringify(this));
    }
    return this._raw;
  }

  needSave() {
    return this._changed;
  }
}

export { SecureCookie };
