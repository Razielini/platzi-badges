const MongoLib = require('../lib/mongo');

class RoutesService {
  constructor() {
    this.collection = "routes";
    this.mongoDB = new MongoLib();
  }

  async findByName({ name }) {
    const item = await this.mongoDB.findByName(this.collection, name);
    return item || false;
  }

  async create(data) {
    let item = await this.findByName({ name: data.name })
    if (item) {
      item = await this.update({ Id:item._id, data })
    } else {
      item = await this.mongoDB.create(this.collection, data);
    }
    item = await this.get({ Id:item });
    return item;
  }

  async update({ Id, data } = {}) {
    const item = await this.mongoDB.update(
      this.collection,
      Id,
      data
    )
    return item
  }
}

module.exports = RoutesService;