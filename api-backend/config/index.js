require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  DB_USER: process.env.DB_USER,
  DB_PASSWD: process.env.DB_PASSWD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  APP_PORT: process.env.APP_PORT,
  APP_DAYS_TO_NEW_SCRAP: process.env.APP_DAYS_TO_NEW_SCRAP
}

module.exports = { config };