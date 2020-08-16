import React from 'react';
import useTranslation from '../utils/lang';
import './../sass/pages/studentProfile.scss';
import Loading from '../components/loading';
import Error from '../components/error';
import searchSVG from '../assets/search.svg'
import { useHistory } from "react-router-dom";
import { API_URL } from '../config'


const STATES_API = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const { LOADING, SUCCESS, ERROR } = STATES_API

const StudentProfile = (props) => {
  const profileName = props.match.params.profileName

  const { t } = useTranslation('common')
  const history = useHistory();

  const handleSearch = () => {
    history.push('/');
  }

  const [state, setState] = React.useState('');
  const [data, setData] = React.useState([]);
  const [badge, setBadge] = React.useState('');

  React.useEffect(() => {
    setState(LOADING);
    fetch(`${API_URL}/${profileName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data::', data)
        setData(data.data);
        setState(SUCCESS);

        data.data.scrapers.map((scrap) => {
          scrap.courses.map((courseName) => {
            let found = false
            //console.log(courseName)
            scrap.coursesInfo.map((course) => {
              //console.log(course.name)
              if(courseName === course.name) {
                found = true
              }
            })
            if(!found) {
              console.log(courseName)
            }
          })
        })


      })
      .catch((e) => {
        setState(ERROR);
      });
  }, []);

  if (state === LOADING) {
    return <Loading />;
  } else if (state === ERROR) {
    return <Error />;
  } if (state !== SUCCESS) {
    return <p>Not Yet</p>;
  }

  const { resume, scrapers } = data

  const reduceLevelCourses = (scrapers) => {
    let result = {
      level: {}, area: {}
    }
    scrapers.forEach(scraps => {
      console.log('scraps :: ', scraps)
        const { coursesInfo } = scraps
        coursesInfo.map(course => {
          console.log('course.level::', course.level)
          if(result.level[course.level] !== undefined) {
            result.level[course.level] += 1
          } else {
            result.level[course.level] = 0
          }

          if(result.area[course.area] !== undefined) {
            result.area[course.area] += 1
          } else {
            result.area[course.area] = 0
          }
        })
    })

    console.log('Reducer:: ', result)
    return result
  }

  const handleBadge = () => {
    fetch(`http://localhost:8000/profile/${profileName}`)
      .then((response) => response.blob())
      .then((data) => {
        //console.log('data::', data)
        setBadge(data.data);
        //setState(SUCCESS);
        //console.log(data.data)
      })
      .catch((e) => {
        setState(ERROR);
      });
  }

  const resumeLevel = reduceLevelCourses(scrapers)
  // console.log('resumeLevel:: ', resumeLevel)

  return (
    <div className="student-profile">
      <div className="padding-y-1 bubble bubble--search-again cursor-pointer bubble--border-light" onClick={handleSearch}>
        <img src={searchSVG} alt='Search again' />
        <p className="big margin-y-0">Search another profile</p>
      </div>


      <div className="resume">
        <div>
          <div className="bubble bubble--avatar">
            <img
              src={data.avatar}
              alt="Profile"
            />
          </div>

          <div className="padding-y-1 bubble bubble--highlight cursor-pointer">
            <p className="big margin-y-0">{ data.name }</p>
            <p className="smaller margin-y-0">{ data.profileName }</p>
          </div>

        </div>
        <div className="resume__stats">
        <div className="resume__stats--options">
          <div className="bubble bubble--platzistats cursor-pointer">
            <p>{ t('platzistats') }</p>
          </div>
          <div
            className="bubble bubble--get-badge cursor-pointer"
            onClick={()=> window.open(`http://localhost:8000/profile/${profileName}`, "_blank")}
          >
            <p>Get my Badge</p>
          </div>
        </div>

          <div className="PlatziStats__container">
            <div className="PlatziStats__container--platform">
              <div className="bubble bubble--highlight bubble--border-light">
                <p className="small">{ t('points') }:</p>
                <p className="bigger">{ resume.platziPoints }</p>
              </div>
              <div className="bubble bubble--highlight bubble--border-light">
                <p className="small">{ t('questions') }:</p>
                <p className="bigger">{ resume.platziQuestions }</p>
              </div>
              <div className="bubble bubble--highlight bubble--border-light">
                <p className="small">{ t('answers') }:</p>
                <p className="bigger">{ resume.platziAnswers }</p>
              </div>
            </div>
            <div className="PlatziStats__container--courses">
              <div className="bubble bubble--highlight bubble--border-light">
                <p className="small">{ t('courses') }:</p>
                <p className="bigger">{ resume.coursesTotal }</p>
              </div>
              <div className="bubble bubble--highlight bubble--border-light">
                <p className="small">{ t('lessons') }:</p>
                <p className="bigger">{ resume.lessons }</p>
              </div>
              <div className="bubble bubble--border-light"></div>
            </div>
            <div className="PlatziStats__container--time">
              <div className="bubble bubble--border-light">
                <p className="big">{ t('studytime') }:</p>
              </div>
              <div className="bubble bubble--highlight flex-center bubble--border-light">
                <p className="bigger">{ resume.hours }h : { resume.minutes }m : { resume.seconds }s </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="PlatziStats__container">
        <div className="PlatziStats__container--level-description">
          <div className="bubble bubble--border-light">
            <p className="bigger">Level:</p>
          </div>
          <div className="PlatziStats__container--level-info">
            <div className="bubble bubble--highlight bubble--border-light">
              <p className="small">{ t('basic') }:</p>
              <p className="bigger">{ resumeLevel.level.Básico || 0 }</p>
            </div>
            <div className="bubble bubble--highlight bubble--border-light">
              <p className="small">{ t('intermediate') }:</p>
              <p className="bigger">{ resumeLevel.level.Intermedio || 0 }</p>
            </div>
            <div className="bubble bubble--highlight bubble--border-light">
              <p className="small">{ t('advanced') }:</p>
              <p className="bigger">{ resumeLevel.level.Avanzado || 0 }</p>
            </div>
          </div>
        </div>
        <div className="PlatziStats__container--level-description">
          <div className="bubble bubble--border-light">
            <p className="bigger">Areas:</p>
          </div>
          <div className="PlatziStats__container--level-info">
          <div className="bubble bubble--develop cursor-pointer text-white">
            <p className="small">Desarrollo e Ingenieria:</p>
            <p className="bigger">{ resumeLevel.area['Desarrollo e ingeniería'] || 0 }</p>
          </div>
          <div className="bubble bubble--design-ux cursor-pointer text-white">
            <p className="small">Diseño y UX:</p>
            <p className="bigger">{ resumeLevel.area['Diseño y UX'] || 0 }</p>
          </div>
          <div className="bubble bubble--marketing cursor-pointer text-white">
            <p className="small">Marketing:</p>
              <p className="bigger">{ resumeLevel.area['Marketing'] || 0 }</p>
          </div>
          <div className="bubble bubble--business cursor-pointer text-white">
            <p className="small">Negocios y emprendimiento:</p>
            <p className="bigger">{ resumeLevel.area['Negocios y emprendimiento'] || 0 }</p>
          </div>
          <div className="bubble bubble--audiovisual cursor-pointer text-white">
            <p className="small">Producción Audiovisual:</p>
            <p className="bigger">{ resumeLevel.area['Producción Audiovisual'] || 0 }</p>
          </div>

          <div className="bubble bubble--personal-growth cursor-pointer text-white">
            <p className="small">Crecimiento Profesional:</p>
            <p className="bigger">{ resumeLevel.area['Crecimiento Profesional'] || 0}</p>
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile
