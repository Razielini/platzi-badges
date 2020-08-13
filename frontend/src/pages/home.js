import React, { useState } from 'react'
import '../sass/pages/home.scss'
import { useHistory } from "react-router-dom";
import useTranslation from '../utils/lang';

export function Home () {

  const [formData, setFormData] = useState({
    nameProfile: '',
  });

  const history = useHistory();
  const { t } = useTranslation('common')

  function handleSubmit() {
    history.push(`/profile/@${formData.nameProfile}`);
  }

  const handleChangeInput = (e) => {
    const {
      target: {
        dataset: { name }, // Obtengo el nombre del campo
        value, // Obtengo el valor
      },
    } = e;
    const updatedFormData = { ...formData };
    updatedFormData[name] = value;
    setFormData(updatedFormData);
  };

  return (
    <div className='Home'>
      <form onSubmit={handleSubmit}>
        <div className='bubble bubble-home bubble--highlight bubble--border-light'>
          <p>https://platzi.com/@</p>
          <input
            required
            type='text'
            onChange={handleChangeInput}
            value={formData.nameProfile}
            placeholder={ t('placeholder-input') }
            data-name='nameProfile'
          />
        </div>
        <button
          className='bubble'
          type='submit'
        >
          { t('search') }
        </button>
      </form>
    </div>
  )
}