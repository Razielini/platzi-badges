require('dotenv').config();

console.log('process.env.API_URL::', process.env)
const config = {
  API_URL: process.env.REACT_APP_API_URL,
}

module.exports = config