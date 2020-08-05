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
  // INIT PARAMETERS
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    this.DB_NAME = DB_NAME;
  }

  /* CONNECT to mongo DB */
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

  /* Find a record using the NAME tag */
  findByName(collection, name) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ name });
    });
  }

  /* Create a new object */
  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  /* Update a record using the ID and the COLLECTION  */
  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne({ _id: ObjectID(id) }, { $set: data });
      })
      .then((result) => result.upsertedId || id);
  }
}

module.exports = MongoLib;