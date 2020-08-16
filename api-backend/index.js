const express = require('express')
const { config } = require('./config')
const profile = require('./routes/profile');
const apiService = require('./routes/apiService');
const cors = require('cors')

const app = express()

const { APP_PORT } = config

app.use(express.json())
app.use(cors())

profile(app);
apiService(app);

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${APP_PORT}`)
})