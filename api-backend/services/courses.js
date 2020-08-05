const MongoLib = require('../lib/mongo');

class CoursesService {
  constructor() {
    this.collection = "courses";
    this.mongoDB = new MongoLib();
  }

  async compareCourses(courses) {
    const item = await this.mongoDB.getAllByName(this.collection, courses);
    console.log('item :: ', item.length)
    const courseTime = await item.reduce((accumulator, currentValue) => accumulator + currentValue.totalTimeInSeconds, 0)
    const totalLessons = await item.reduce((accumulator, currentValue) => accumulator + currentValue.totallessons, 0)
    let info = {
      totalTimeSeconds: courseTime,
      hours: Math.floor(courseTime / 3600),
      minutes: 0,
      seconds: 0,
      lessons: totalLessons,
      coursesInfo: item,
      coursesTotal: courses.length
    }

    info.minutes = Math.floor((courseTime - (info.hours * 3600)) / 60)
    info.seconds = courseTime - ((info.hours * 3600) + (info.minutes * 60))
    return info;
  }
}

module.exports = CoursesService;
