
const CoursesService = require('../services/courses')
const coursesService = new CoursesService();

const formatScrapyData = async (data) => {
  const { name, profileName, platziAnswers, platziPoints, platziQuestions, flag, ownProjects, avatar } = data

  /* GET COUNTRY FROM FLAG */
  /* EXAMPLE: https://static.platzi.com/media/flags/MX.png */
  const regExpCountry = /([a-zA-Z]{2}).png$/i;
  let country = flag.match(regExpCountry)[1]

  /* GET USER IMAGE FROM AVATAR */
  /* EXAMPLE: https://static.platzi.com/media/avatars/avatars/raziel.carvajal_5a1f0166-887a-492d-8cc0-dab375b4a7ec.jpg */
  /* DOUBLE   '/avatars/avatars/' in URL */
  console.log('avatar ::', avatar)
  // const regExpAvatar = /(avatars\/){2}(\S+)$/i;
  // let userAvatar = avatar.match(regExpAvatar)[2];

  /* COMPARE LIST OF COURSES WITH REAL COURSES */
  data.coursesFinished = await coursesService.compareCourses(data.coursesFinished)

  const { coursesTotal, hours, lessons, minutes, seconds, totalTimeSeconds, coursesInfo, courses } = data.coursesFinished

  const resume = {
    platziAnswers,
    platziPoints,
    platziQuestions,
    coursesTotal,
    hours,
    lessons,
    minutes,
    seconds,
    totalTimeSeconds,
    ownProjects
  }

  return {
    name,
    avatar,
    profileName,
    country,
    resume,
    updated_at: new Date(),
    scrapers: [
      {
        resume,
        coursesInfo,
        courses,
        created_at: new Date(),
      }
    ]
  }

}

module.exports = formatScrapyData
