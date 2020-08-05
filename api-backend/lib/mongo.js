const { MongoClient, ObjectID } = require('mongodb');
const { config } = require('../config');

const {
  DB_USER,
  DB_PASSWD,
  DB_HOST,
  DB_NAME
} = config

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.DB_NAME = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }

          // eslint-disable-next-line no-console
          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  findByName(collection, profileName) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ profileName });
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectID(id) });
    });
  }

  create(collection, data) {
    console.log('create ::', data)
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne({ _id: ObjectID(id) }, { $set: data });
      })
      .then((result) => result.upsertedId || id);
  }

}

module.exports = MongoLib;