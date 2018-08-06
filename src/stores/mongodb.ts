"use strict";
import {
  Store,
  CoreModel
} from '../index';

var MongoClient = require('mongodb').MongoClient;


/**
 * Store Objects in MongoDB
 *
 * Parameters:
 *   mongo: 'mongodb://127.0.0.1:27017' // If not found try to read WEBDA_MONGO_URL env variable
 *
 */
class MongoStore < T extends CoreModel > extends Store < T > {
  _connectPromise: Promise < any > = undefined;
  _client: any;
  _db: any;
  _collection: any;

  /** @ignore */
  constructor(webda, name, options) {
    super(webda, name, options);
    this._connectPromise = undefined;
    if (options.mongo === undefined || options.mongo === '') {
      this._params.mongo = options.mongo = process.env["WEBDA_MONGO_URL"];
    }
    if (this._params.mongo) {
      // Get the database name from url
      this._params.mongoDb = this._params.mongo.substr(this._params.mongo.lastIndexOf('/') + 1);
    }
    if (!webda._configurationMode && options.collection === undefined || options.mongo === undefined || this._params.mongoDb === undefined) {
      this._createException = "collection and url must be setup";
    }
  }

  async _connect() {
    if (this._connectPromise === undefined) {
      this._connectPromise = new Promise((resolve, reject) => {
        MongoClient.connect(this._params.mongo, (err, client) => {
          if (err) {
            return reject(err);
          }
          this._client = client;
          this._db = client.db(this._params.mongoDb);
          this._collection = this._db.collection(this._params.collection);
          return resolve();
        });
      });
    }
    return this._connectPromise;
  }

  async exists(uid) {
    // Should use find + limit 1
    return (await this._get(uid)) !== undefined;
  }

  async _deleteItemFromCollection(uid, prop, index, itemWriteCondition, itemWriteConditionField) {
    await this._connect();

    let filter = {
      _id: uid
    };
    if (itemWriteCondition) {
      filter[prop + "." + index + '.' + itemWriteConditionField] = itemWriteCondition;
    }
    let params = {
      '$unset': {}
    };
    params['$unset'][prop + "." + index] = 1;
    let res = await this._collection.updateOne(filter, params);
    if (!res.result.n) {
      throw Error('UpdateCondition not met');
    }
    let remove = {
      '$pull': {}
    };
    remove['$pull'][prop] = null;
    await this._collection.update({
      _id: uid
    }, remove);
  }

  async _incrementAttribute(uid, prop, value) {
    await this._connect();
    var params = {
      '$inc': {}
    };
    params['$inc'][prop] = value;
    return this._collection.updateOne({
      _id: uid
    }, params);
  }

  async _upsertItemToCollection(uid, prop, item, index, itemWriteCondition, itemWriteConditionField = 'uuid') {
    // TODO Handle condition
    await this._connect();
    let filter = {
      _id: uid
    };
    var params = {};
    if (index === undefined) {
      params = {
        '$push': {}
      };
      params['$push'][prop] = item;
    } else {
      params = {
        '$set': {}
      };
      params['$set'][prop + "." + index] = item;
      filter[prop + "." + index + "." + itemWriteConditionField] = itemWriteCondition;
    }
    let res = await this._collection.updateOne(filter, params);
    if (!res.modifiedCount) {
      throw Error('UpdateCondition not met');
    }
  }

  async _save(object, uid) {
    if (object instanceof CoreModel) {
      object = object.toStoredJSON();
    }
    object._id = object.uuid;
    await this._connect();
    await this._collection.insertOne(object);
    return object;
  }

  async _find(request) {
    await this._connect();
    return this._collection.find(request);
  }

  async _delete(uid, writeCondition) {
    await this._connect();
    return this._collection.deleteOne({
      _id: uid
    });
  }

  _update(object, uid, writeCondition) {
    if (object instanceof CoreModel) {
      object = object.toStoredJSON();
    }
    return this._connect().then(() => {
      return this._collection.updateOne({
        _id: uid
      }, {
        '$set': object
      });
    }).then((result) => {
      return Promise.resolve(object);
    });
  }

  getAll(uids) {
    return this._connect().then(() => {
      let params: any = {};
      if (uids) {
        params._id = {
          $in: uids
        };
      }
      return this._collection.find(params);
    }).then((result) => {
      return result.toArray();
    }).then((items) => {
      return items.map(this.initModel, this);
    });
  }

  _get(uid) {
    return this._connect().then(() => {
      return this._collection.findOne({
        _id: uid
      });
    }).then((result) => {
      return Promise.resolve(result === null ? undefined : result);
    });
  }

  __clean() {
    return this._connect().then(() => {
      return this._collection.deleteMany();
    });
  }

  static getModda() {
    return {
      "uuid": "Webda/MongoStore",
      "label": "MongoStore",
      "description": "Implements MongoDB NoSQL",
      "webcomponents": [],
      "documentation": "https://raw.githubusercontent.com/loopingz/webda/master/readmes/Store.md",
      "logo": "images/icons/mongodb.png",
      "configuration": {
        "default": {
          "mongourl": "mongodb://127.0.0.1:27017",
        },
        "widget": {
          "tag": "webda-store-configurator",
          "url": "elements/services/webda-store-configurator.html"
        },
        "schema": {
          type: "object",
          properties: {
            "mongourl": {
              type: "string"
            }
          },
          required: ["mongourl"]
        }
      }
    }
  }
}

export {
  MongoStore
};
