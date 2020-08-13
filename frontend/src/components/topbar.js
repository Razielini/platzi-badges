import React, { useState } from 'react';
import '../sass/components/topbar.scss'
import useTranslation from '../utils/lang'

const Topbar = () => {
  const { t, i18n } = useTranslation('common')
  const [state, setState] = useState('day');

  const handleThemeChange = (event) => {
    const theme = event.currentTarget.getAttribute('data-value');
    document.body.setAttribute('data-theme', theme);
    setState(theme)
  }

  return (
    <div className="Topbar">
      <div className="Topbar__container">
        <nav>
          <ul>
            <li className="display-flex">
              <div className="bubble">
                { t('languaje') }
              </div>
              <div
                className={`bubble cursor-pointer ${i18n.language === 'mx' ? 'bubble--highlight' : ''}`}
                onClick={() => i18n.changeLanguage('mx')}
              >
                MX
              </div>
              <div
                className={`bubble cursor-pointer ${i18n.language === 'en' ? 'bubble--highlight' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                US
              </div>
            </li>
            <li className="display-flex">
              <div
                className={`bubble cursor-pointer bubble--border-light ${state === 'day' && 'bubble--theme-selected' }`}
                data-value="day"
                onClick={handleThemeChange}
              >
                { t('day') }
              </div>
              <div
                className={`bubble cursor-pointer bubble--border-light ${state === 'night' && 'bubble--theme-selected' }`}
                data-value="night"
                onClick={handleThemeChange}
              >
                { t('night') }
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Topbar