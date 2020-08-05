const puppeteer = require('puppeteer');

const getProfileInfo = async (profile) => {

  const waitUntil = 'networkidle0'
  const timeout = 0

  // Open browser
  const browser = await puppeteer.launch({ headless: true });

  // Open a page in the browser
  const page = await browser.newPage();

  // Configure the size of the viewport
  await page.setViewport({ width: 1200, height: 720 });

  // Go to platzi profile
  await page.goto('https://platzi.com/' + profile, { waitUntil, timeout }); // wait until page load

  //Click on see more to see all courses
  console.log(`Puppeter GO TO:: https://platzi.com/${profile}`)

  const coursesFinished = await page.evaluate(() => Array.from (document.querySelectorAll('div.Course-title'), element => element.innerText))

  //Retrieve user avatar
  const avatar = await page.evaluate(() => document.querySelector('figure.ProfileHeader-avatar img').src);
  const name = await page.evaluate(() => document.querySelector('h1.ProfileHeader-name').innerHTML);
  const flag = await page.evaluate(() => document.querySelector('img.ProfileHeader-flag').src);

  console.log('Avatar ::', avatar)

  //score [1]: Puntos
  //score [2]: Preguntas
  //score [3]: Respuestas
  const scores = await page.evaluate(() => Array.from (document.querySelectorAll('.ProfileScore-number'), element => element.innerHTML))

  console.log('scores ::', scores)


  let ownProjects = []

  try {
    await page.click('div.Tabs div:not(.is-active)')
    if (await page.waitForSelector('div.Profile-projects div.Project', {
      timeout: 1000
    })) {
      console.log('ownProjects :: ')

      ownProjects = await page.evaluate(() => Object.values(document.getElementsByClassName('Project'))
        .map((project) => {
          const name = project.getElementsByClassName('Project-title')[0].innerText
          const image = project.querySelector('.Project-picture img').src
          const url = project.getElementsByClassName('Project-url')[0].href
          const description = project.getElementsByClassName('Project-description')[0].innerText
          const learnSkills = project.getElementsByClassName('Project-text')[0].innerText

          return {
            name,
            image,
            url,
            description,
            learnSkills
          };
        }).filter((projectInfo) => projectInfo.name.indexOf('%') === -1));
    } // WAIT FOR SELECTOR
  } catch (error) {
    console.log('Error Click Own Projects:: ', error)
  }

  await browser.close()

  return {
    avatar,
    name,
    profileName: profile,
    flag,
    coursesFinished,
    platziPoints: scores[0],
    platziQuestions: scores[1],
    platziAnswers: scores[2],
    ownProjects: ownProjects.length
  }
}

module.exports.getProfileInfo = getProfileInfo