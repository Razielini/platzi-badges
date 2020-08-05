const express = require('express')
const { config } = require('./config')
const profile = require('./routes/profile');

const app = express()

const { APP_PORT } = config

app.use(express.json())

profile(app);


app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${APP_PORT}`)
})