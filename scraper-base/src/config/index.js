require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  DB_USER: process.env.DB_USER,
  DB_PASSWD: process.env.DB_PASSWD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_COURSES_URL: process.env.DB_COURSES_URL,
  LOGIN_USER: process.env.LOGIN_USER,
  LOGIN_PASS: process.env.LOGIN_PASS
}

module.exports = { config };