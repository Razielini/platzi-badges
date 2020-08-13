const { config } = require('./config');

const {
  DB_COURSES_URL,
  LOGIN_USER,
  LOGIN_PASS
} = config

/* GET THE COURSES DATA OF PUBLIC INFO 

const getRoutesData = require('./utils/getRoutesData')

console.log('DB_COURSES_URL::', DB_COURSES_URL)
getRoutesData(DB_COURSES_URL).then(res => {
  console.log('[Finish] getRoutesData')
})

/* GET THE COURSES DATA OF PRIVATE INFO
  - NEED LOGIN
  - USEFUL FOR COURSES NOT PUBLIC OR NOT ON ROUTE
  - Example: {
      course: 'https://platzi.com/clases/introduccion-marketing-digital/',
      area: 'Marketing'
    }
*/

const getCourseData = require('./utils/getCourseData')

const COURSES_URL = [
  {
    course: 'https://platzi.com/clases/introduccion-marketing-digital/',
    area: 'Marketing'
  }
]

console.log('COURSES_URL::', COURSES_URL)
console.log('LOGIN_USER::', LOGIN_USER)
console.log('LOGIN_PASS::', LOGIN_PASS)
getCourseData(COURSES_URL, LOGIN_USER, LOGIN_PASS).then(res => {
  console.log('[Finish] getCourseData')
})



/* GET THE ROUTES DATA OF PRIVATE INFO
  - NEED LOGIN
  - USEFUL FOR COURSES NOT PUBLIC OR NOT ON ROUTE
  - Example: https://platzi.com/idioma-ingles/


const getRoutesPrivateData = require('./utils/getRoutesPrivateData')

const ROUTES_URL = [
  {
    route: 'https://platzi.com/idioma-ingles/',
    area: 'Crecimiento Profesional'
  },
  {
    route: 'https://platzi.com/videojuegos/',
    area: 'Desarrollo e ingeniería'
  }
]

console.log('ROUTES_URL::', ROUTES_URL)
console.log('LOGIN_USER::', LOGIN_USER)
console.log('LOGIN_PASS::', LOGIN_PASS)
getRoutesPrivateData(ROUTES_URL, LOGIN_USER, LOGIN_PASS).then(res => {
  console.log('[Finish] getRoutesPrivateData')
})
*/