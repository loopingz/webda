import {
  Store,
  CoreModel
} from '../index';

interface StorageMap {
  [key: string]: any;
}

class MemoryStore < T extends CoreModel > extends Store < T > {
  storage: StorageMap;
  async init(config): Promise < void > {
    this.storage = {};
    return super.init(config);
  }

  async exists(uid) {
    return this.storage[uid] !== undefined;
  }

  async _find(request, offset, limit): Promise < any > {
    // Need to transfert to Array
    return this.storage;
  }

  async _save(object, uid) {
    uid = uid || object.uuid;
    if (!(object instanceof this._model)) {
      object = this.initModel(object);
    }
    this.storage[uid] = object.toStoredJSON(true);
    return this._getSync(uid);
  }

  async _delete(uid) {
    delete this.storage[uid];
  }

  async _update(object, uid) {
    uid = uid || object.uuid;
    let obj = this._getSync(uid);
    for (let prop in object) {
      obj[prop] = object[prop];
    }
    this.storage[uid] = obj.toStoredJSON(true);
    return this._getSync(uid);
  }

  async getAll(uids): Promise < any > {
    if (!uids) {
      return Object.keys(this.storage).map((key) => {
        return this._getSync(key);
      });
    }
    let result = [];
    for (let i in uids) {
      if (this.storage[uids[i]]) {
        result.push(this._getSync(uids[i]));
      }
    }
    return result;
  }

  _getSync(uid) {
    if (this.storage[uid]) {
      return this.initModel(JSON.parse(this.storage[uid]));
    }
    return null;
  }

  async _get(uid) {
    if (!this.storage[uid]) return;
    return this._getSync(uid);
  }

  async __clean() {
    this.storage = {};
  }

  async _incrementAttribute(uid, prop, value, updateDate: Date) {
    var res = this.storage[uid];
    if (res === undefined) {
      throw Error("NotFound");
    }
    res = this._getSync(uid);
    if (!res[prop]) {
      res[prop] = 0;
    }
    res.lastUpdate = updateDate;
    res[prop] += value;
    return this._save(res, uid);
  }

  async _upsertItemToCollection(uid, prop, item, index, itemWriteCondition, itemWriteConditionField, updateDate: Date) {
    var res = this.storage[uid];
    if (res === undefined) {
      throw Error("NotFound");
    }
    res = this._getSync(uid);
    if (index === undefined) {
      if (itemWriteCondition !== undefined && res[prop].length !== itemWriteCondition) {
        console.log('met', itemWriteCondition, res[prop].length, itemWriteCondition);
        throw Error('UpdateCondition not met');
      }
      if (res[prop] === undefined) {
        res[prop] = [item];
      } else {
        res[prop].push(item);
      }
    } else {
      if (itemWriteCondition && res[prop][index][itemWriteConditionField] != itemWriteCondition) {
        throw Error('UpdateCondition not met');
      }
      res[prop][index] = item;
    }
    res.lastUpdate = updateDate;
    await this._save(res, uid);
  }

  async _deleteItemFromCollection(uid, prop, index, itemWriteCondition, itemWriteConditionField, updateDate: Date) {
    var res = this.storage[uid];
    if (res === undefined) {
      throw Error("NotFound");
    }
    res = this._getSync(uid);
    if (itemWriteCondition && res[prop][index][itemWriteConditionField] != itemWriteCondition) {
      throw Error('UpdateCondition not met');
    }
    res[prop].splice(index, 1);
    res.lastUpdate = updateDate;
    return this._save(res, uid);
  }

  static getModda() {
    return {
      "uuid": "Webda/MemoryStore",
      "label": "MemoryStore",
      "description": "Implements a simple in memory store",
      "webcomponents": [],
      "documentation": "",
      "logo": "images/placeholders/memorystore.png",
      "configuration": {
        "default": {},
        "widget": {
          "tag": "webda-store-configurator",
          "url": "elements/services/webda-store-configurator.html"
        },
        "schema": {
          type: "object",
          properties: {}
        }
      }
    }
  }
}


export {
  MemoryStore,
  StorageMap
};
