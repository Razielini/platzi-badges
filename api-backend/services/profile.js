const MongoLib = require('../lib/mongo');

class ProfilesService {
  constructor() {
    this.collection = "profiles";
    this.mongoDB = new MongoLib();
  }

  async findByName(profile) {
    console.log('profile :: ', profile)
    const item = await this.mongoDB.findByName(this.collection, profile);
    console.log('profile :: item :: ', item)
    return item || false;
  }

  async create(profile) {
    const item = await this.mongoDB.create(this.collection, profile);
    return item;
  }
}

module.exports = ProfilesService;
