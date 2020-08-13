const puppeteer = require('puppeteer');
const RoutesService = require('../services/routes')
const CoursesService = require('../services/courses')

const routesService = new RoutesService();
const coursesService = new CoursesService();

const getRoutesPrivateData = (ROUTES_URL, LOGIN_USER, LOGIN_PASS) => new Promise(async (resolve, rejected) => {

  // Params
  const waitUntil = 'networkidle0'
  const timeout = 0

  // Other Variables
  const routeTimeInSeconds = 0
  const TEST_RUN = false // DONT SAVE DATA ONLY RUN SCRAPER

  // Open browser
  const browser = await puppeteer.launch({ headless: true });

  // Open a page in the browser
  const page = await browser.newPage();

  // Configure the size of the viewport
  await page.setViewport({ width: 1200, height: 720 });

  console.info('[INIT] Scrap to PRIVATE ROUTES: ')

  console.info('[INIT] Scrap to: Platzi Login')
  // Go to platzi login
  await page.goto('https://platzi.com/login/', { waitUntil, timeout }); // wait until page load

  // Enter login parameters
  await page.type('[name="email"]', LOGIN_USER);

  await page.type('[name="password"]', LOGIN_PASS);

  // Click to login
  await Promise.all([
    page.click('[class="btn-Green btn--md"]'),
    page.waitForNavigation({ waitUntil, timeout }),
  ]);

  const useRoutes = ROUTES_URL

  console.info('[INIT] ROUTES ', useRoutes.length)
  for (let i = 0; i < useRoutes.length; i++) {
    console.info(`[INIT] ROUTE [${i}/${useRoutes.length}] `, useRoutes[i])
    await page.goto(useRoutes[i].route, { waitUntil, timeout })

    const { routeBadge, routeName, routeDescription } = await page.evaluate(async () => {
      const routeBadge = document.querySelector('figure.CoursePancakeBadge img').src
      const routeName = document.querySelector('h1').innerHTML
      const routeDescription = document.querySelector('div.Hero-route-desc span').innerHTML

      return {
        routeBadge,
        routeName,
        routeDescription
      }
    })

    let routeCourses = await page.evaluate(() => Array.from (document.querySelectorAll('div.RoutesContent-content a.RoutesList-item'), element => element.href))

    const routeData = {
      badge: routeBadge,
      name: routeName,
      description: routeDescription,
      area: useRoutes[i].area,
      order: i + 1,
      totalTimeInSeconds: 0,
      courses: []
    }

    console.info('[SAVE] ROUTE ', routeData.name)
    let route = {}
    TEST_RUN ? route = routeData : route = await routesService.create(routeData)

    console.info('[INIT] COURSES ', routeCourses.length)
    for (let j = 0; j < routeCourses.length; j++) {
      try {
        routeCourses[j] = routeCourses[j].replace('/cursos/', '/clases/')

        console.info(`[INIT] COURSE [${j}/${routeCourses.length}] `, routeCourses[j])
        await page.goto(routeCourses[j], { waitUntil, timeout })

        const { badge, name, level } = await page.evaluate(async () => {
          const badge = document.querySelector('figure.CourseDetail-left-figure img').src
          const name = document.querySelector('h1.CourseDetail-left-title').innerText
          const level = document.querySelector('figcaption.CourseLevel-label').innerText

          return {
            badge,
            name,
            level
          }
        })

        const lessons = await page.evaluate(() => Object.values(document.getElementsByClassName('MaterialItem'))
        .map((lesson, i) => {
          const name = lesson.getElementsByClassName('MaterialItem-copy-title')[0].innerText
          const isVideo = lesson.getElementsByClassName('MaterialItem-video')[0] ? true : false
          const isReading = lesson.getElementsByClassName('MaterialItem-reading')[0] ? true : false

          let time = lesson.getElementsByClassName('MaterialItem-copy-time')[0]
          let realTime = 0
          let totalTimeInSeconds = 0

          if (time) {
            time = time.innerText
            realTime = time.split(' ')
            realTime = realTime[0].split(':')
            totalTimeInSeconds = parseInt(realTime) * 60 + parseInt(realTime[1])
          }

          return {
            name,
            time,
            totalTimeInSeconds,
            isVideo,
            isReading,
            order: i + 1
          };
        }).filter((lessonsInfo) => lessonsInfo.name.indexOf('%') === -1));

        let courseTimeInSeconds = Object.keys(lessons).reduce((previous, key) => {
          return previous + lessons[key].totalTimeInSeconds;
        }, 0);

        let course = {}
        TEST_RUN ? course = {
          badge,
          name,
          level,
          area: useRoutes[i].area,
          url: routeCourses[j],
          order: j + 1,
          lessons,
          routes: route._id,
          totalTimeInSeconds: courseTimeInSeconds,
          totallessons: lessons.length
        } : course = await coursesService.create({
          badge,
          name,
          level,
          area: useRoutes[i].area,
          url: routeCourses[j],
          order: j + 1,
          lessons,
          routes: route._id,
          totalTimeInSeconds: courseTimeInSeconds,
          totallessons: lessons.length
        })

        console.info('[SAVE] COURSE ', course.name)

        route.totalTimeInSeconds += courseTimeInSeconds
        route.courses.push(course)
      } catch (error) {
        console.error(`[ERROR] COURSE ${routeCourses[j]} `, error)
      }
    }

    console.error(`[UPDATE] ROUTE `, route.name)
    if(!TEST_RUN) await routesService.update({ Id:route._id, data: route })
  }

  await browser.close()
  console.error('[FINISH] SCRAP')
  resolve(true)
})

module.exports = getRoutesPrivateData