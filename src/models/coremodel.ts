"use strict";
const uuid = require('uuid');
import { OwnerPolicy } from '../policies/ownerpolicy';

interface CoreModelDefinition {
  new (raw: any, secure: boolean) : CoreModel
}

/**
 * First basic model for Ident
 * Will evolve with version 0.2 and Model addition
 *
 * @class
 */
class CoreModel extends OwnerPolicy {

  __store: any
  static getActions() {
    return {};
  }

  getAvailableActions() {
    return {};
  }

  /**
   * @ignore
   */
  constructor(raw, secure : boolean = false) {
    super();
    this.load(raw, secure);
  }

  load(raw, secure : boolean = false) {
    if (!raw) {
      return;
    }
    if (!raw.uuid) {
      raw.uuid = this.generateUid();
    }
    for (let prop in raw) {
      if (!secure && (prop[0] === "_")) {
        continue;
      }
      this[prop] = raw[prop];
    }
  }

  /**
   * Return the object registered store
   */
  getStore() {
    return this.__store;
  }

  /**
   * Get the object again
   *
   * @throws Error if the object is not coming from a store
   */
  async refresh() {
    if (!this.__store) {
      throw Error("No store linked to this object");
    }
    let obj = await this.__store.get(this.uuid);
    for (var i in obj) {
      this[i] = obj[i];
    }
    return this;
  }

  /**
   * Delete this object
   *
   * @throws Error if the object is not coming from a store
   */
  async delete() {
    if (!this.__store) {
      throw Error("No store linked to this object");
    }
    return this.__store.delete(this.uuid);
  }

  /**
   * Save this object
   *
   * @throws Error if the object is not coming from a store
   */
  async save() {
    if (!this.__store) {
      throw Error("No store linked to this object");
    }
    let obj = await this.__store.save(this);
    for (var i in obj) {
      this[i] = obj[i];
    }
  }

  /**
   * Update this object
   *
   * @throws Error if the object is not coming from a store
   */
  async update(changes) {
    if (!this.__store) {
      throw Error("No store linked to this object");
    }
    let obj = await this.__store.update(changes, this.uuid);
    for (var i in obj) {
      this[i] = obj[i];
    }
  }

  /**
   * Return the object schema, if defined any modification done to the object by external source
   * must comply to this schema
   */
  _getSchema() {
    return;
  }

  async validate(ctx, updates) {
    let schema = this._getSchema();
    if (!schema) {
      return true;
    }
    if (updates) {
      this.load(updates);
    }
    if (!ctx._webda.validate(this, schema)) {
      throw Error(ctx._webda.validationLastErrors());
    }
    return true;
  }

  generateUid() {
    return uuid.v4();
  }

  _jsonFilter(key, value) {
    if (key[0] === '_' && key.length > 1 && key[1] === '_') {
      return undefined;
    }
    return value;
  }

  toStoredJSON(stringify) {
    let obj = this._toJSON(true);
    obj.__store = undefined;
    if (stringify) {
      return JSON.stringify(obj);
    }
    return obj;
  }

  _getService(service) {
    if (!this.__store) {
      return undefined;
    }
    return this.__store.getService(service);
  }

  _toJSON(secure) {
    let obj : any = {};
    for (let i in this) {
      let value = this[i];
      if (!secure) {
        value = this._jsonFilter(i, this[i]);
      }
      if (value === undefined) continue;
      obj[i] = value;
    }
    return obj;
  }

  toJSON() {
    return this._toJSON(false);
  }
}

export { CoreModel , CoreModelDefinition };
