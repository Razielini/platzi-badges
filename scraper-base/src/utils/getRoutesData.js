const puppeteer = require('puppeteer');
const RoutesService = require('../services/routes')
const CoursesService = require('../services/courses')

const routesService = new RoutesService();
const coursesService = new CoursesService();

const getRoutesData = (DB_COURSES_URL) => new Promise(async (resolve, rejected) => {

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

  console.info('[INIT] Scrap to: ', DB_COURSES_URL)
  await page.goto(DB_COURSES_URL, { waitUntil, timeout })

  const areasItem = await page.evaluate(() => Array.from (document.querySelectorAll('a.CourseCategories-item'), element => element.href))

  console.info('[INIT] CATEGORIES ', areasItem.length)
  for (let h = 0; h < areasItem.length; h++) {
    try {
      console.info(`[INIT] CATEGORIE [${h}/${areasItem.length}] `, areasItem[h])
      await page.goto(areasItem[h], { waitUntil, timeout })
    } catch (error) {
      console.error(`[ERROR] CATEGORIE ${areasItem[h]} `, error)
    }

    const areaName = await page.evaluate(() => document.querySelector('h1 span').innerText)
    const useRoutes = await page.evaluate(() => Array.from (document.querySelectorAll('a.LearningPathItem'), element => element.href))

    console.info('[INIT] ROUTES ', useRoutes.length)
    for (let i = 0; i < useRoutes.length; i++) {
      console.info(`[INIT] ROUTE [${i}/${useRoutes.length}] `, useRoutes[i])
      await page.goto(useRoutes[i], { waitUntil, timeout })

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
        area: areaName,
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
            area: areaName,
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
            area: areaName,
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

  }

  await browser.close()
  console.error('[FINISH] SCRAP')
  resolve(route)
})

module.exports = getRoutesData