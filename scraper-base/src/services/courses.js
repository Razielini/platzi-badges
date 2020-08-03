const MongoLib = require('../lib/mongo');

class CoursesService {
  constructor() {
    this.collection = "courses";
    this.mongoDB = new MongoLib();
  }

  async findByName({ name }) {
    const item = await this.mongoDB.findByName(this.collection, name);
    return item || false;
  }

  async create(data) {
    let item = await this.findByName({ name: data.name })
    if (item) {
      if (!item.routes.includes(data.routes)) {
        item.routes.push(data.routes)
        const routes = new Set(item.routes)
        data.routes = [...routes]
      }
      item = await this.update({ Id:item._id, data })
    } else {
      const { routes } = data
      data.routes = [routes]
      item = await this.mongoDB.create(this.collection, data);
    }
    return item;
  }

  async update({ Id, data } = {}) {
    const item = await this.mongoDB.update(
      this.collection,
      Id,
      data
    );
    return item;
  }

}

module.exports = CoursesService;