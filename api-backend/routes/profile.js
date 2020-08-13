const express = require('express');
const { config } = require('../config')

const ProfilesService = require('../services/profile');
const CoursesService = require('../services/courses')
const createBadge = require('../services/badge')
const profileInfo = require('../utils/getPublicInfoFromProfile')

const path = require('path')
const fs = require('fs');

const { APP_DAYS_TO_NEW_SCRAP } = config

function profileApi(app) {
  const router = express.Router();
  app.use('/profile', router);

  const profilesService = new ProfilesService();
  const coursesService = new CoursesService();

  router.get('/:profileName',
    async function (req, res, next) {
      const { profileName } = req.params;
      console.log('/ ========================', profileName)
      try {
        let existProfile = await profilesService.findByName(profileName);

        let diffDays = 0
        if (existProfile) {
          const oldDate = new Date(existProfile.scrapers[0].created_at)
          const newDate = new Date(2020, 7, 15)

          diffDays = Math.floor(Math.abs((oldDate.getTime() - newDate.getTime()) / ( 24 * 60 * 60 * 1000)));
        }

        if(diffDays >= APP_DAYS_TO_NEW_SCRAP || !existProfile) {
          console.log('Call Scraper::', existProfile)
          new Promise((resolve, reject) => {
            profileInfo
              .getProfileInfo(profileName)
              .then(async (data) => {
                const { platziAnswers, platziPoints, platziQuestions, flag, ownProjects, avatar } = data
                console.log('getProfileInfo:: ', data)
                data.coursesFinished = await coursesService.compareCourses(data.coursesFinished)

                const { coursesTotal, hours, lessons, minutes, seconds, totalTimeSeconds } = data.coursesFinished

                /* GET COUNTRY FROM FLAG */
                /* EXAMPLE: https://static.platzi.com/media/flags/MX.png */
                const regExpCountry = /([a-zA-Z]{2}).png$/i;
                let country = flag.match(regExpCountry)[1]

                /* GET USER IMAGE FROM AVATAR */
                /* EXAMPLE: https://static.platzi.com/media/avatars/avatars/raziel.carvajal_5a1f0166-887a-492d-8cc0-dab375b4a7ec.jpg */
                /* DOUBLE   '/avatars/avatars/' in URL */
                const regExpAvatar = /(avatars\/){2}(\S+).jpg$/i;
                let userAvatar = avatar.match(regExpAvatar)[2];

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

                const saveProfile = {
                  name: data.name,
                  avatar: userAvatar,
                  profileName,
                  country,
                  resume,
                  updated_at: new Date(),
                  scrapers: [
                    {
                      resume,
                      created_at: new Date(),
                    }
                  ]
                }

                console.log('END OF INFO:: ', saveProfile)

                const profile = await profilesService.create(saveProfile)
                console.log('END OF INFO:: ', profile)
                console.log('END OF INFO:: ')

                existProfile = await profilesService.findByName(profileName);

                const svg = createBadge(existProfile.resume, existProfile.profileName)
                fs.writeFileSync (path.resolve(`./results/${existProfile._id}.svg`), svg, 'utf8', function (err) {
                  if (err) return console.log(err);
                  console.log('Created > ${existProfile._id}.svg');
                });

                res.setHeader('Content-Type', 'image/svg+xml');
                res.status(200).sendFile(path.resolve(`./results/${existProfile._id}.svg`));
                resolve();
              })
              .catch(err => reject('Profile2 scrape failed', err))
          })

        } else {
          console.log('Serve Info::', existProfile)

          const svg = createBadge(existProfile.resume, existProfile.profileName)
          fs.writeFileSync (path.resolve(`./results/${existProfile._id}.svg`), svg, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log('Created > ${existProfile._id}.svg');
          });

          res.setHeader('Content-Type', 'image/svg+xml');
          res.status(200).sendFile(path.resolve(`./results/${existProfile._id}.svg`));
        }
      } catch (err) {
        next(err);
      }
    }
  );

}

module.exports = profileApi;