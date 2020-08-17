const express = require('express');
const { config } = require('../config')

const createBadge = require('../services/badge')
const ProfilesService = require('../services/profile');
const profileInfo = require('../utils/getPublicInfoFromProfile')
const formatScrapyData = require('../utils/formatScrapyData')

const { APP_DAYS_TO_NEW_SCRAP } = config

function apiService(app) {
  const router = express.Router();
  app.use('/api/profile', router);

  const profilesService = new ProfilesService();

  router.get('/:profileName',
    async function (req, res, next) {
      const { profileName } = req.params;
      console.log(`[INIT SCRAP] ${profileName}`)
      try {
        console.log(`[SEARCH IN DB] ${profileName}`)
        let existProfile = await profilesService.findByName(profileName);

        let diffDays = 0
        if (existProfile) {
          const oldDate = new Date(existProfile.updated_at)
          const newDate = new Date()

          diffDays = Math.floor(Math.abs((oldDate.getTime() - newDate.getTime()) / ( 24 * 60 * 60 * 1000)));
        }

        if(diffDays >= APP_DAYS_TO_NEW_SCRAP || !existProfile) {
          console.log(`[SCRAP REAL TIME] ${profileName}`)
          new Promise((resolve, reject) => {
            profileInfo
              .getProfileInfo(profileName)
              .then(async (data) => {
                if(!data.success) {
                  if(data.error === "NOT_FOUND") {
                    return res.status(404).json({
                      data: {
                        error: "NOT_FOUND"
                      },
                      success: false
                    });
                  }
                }

                // FORMAT ALL DATA TO SAVE TO DB
                console.log(`[FORMAT SCRAPY DATA] ${profileName}`)
                console.log(data)
                const saveProfile = await formatScrapyData(data)

                const profile = await profilesService.create(saveProfile)
                console.log(`[SAVED ON DB] ${profileName}`)
                console.log(profile)

                existProfile = await profilesService.findByName(profileName);

                const svg = createBadge(existProfile.resume, existProfile.profileName)

                res.status(200).json({
                  data: existProfile,
                  svg,
                  success: true
                });
                resolve();
              })
              .catch(err => {
                console.log(`[ERROR SCRAP] ${profileName}`)
                console.log(err)

                res.status(200).json({
                  data: 'error',
                  success: false
                });
                reject(`[ERROR SCRAP] ${profileName}`)
              })
          })

        } else {
          console.log(`[GET FROM DB] ${profileName}`)
          console.log(existProfile)

          const svg = createBadge(existProfile.resume, existProfile.profileName)

          res.status(200).json({
            data: existProfile,
            svg,
            success: true
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

}

module.exports = apiService;