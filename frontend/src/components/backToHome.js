import React from 'react';
import '../sass/components/backToHome.scss'
import { Link } from 'react-router-dom'

const BackToHome = () => {
  return (
    <div className="BackToHome">
      <Link to="/">
        <div className="padding-y-1 bubble bubble--highlight bubble--warning cursor-pointer">
          <p className="big margin-y-0">Volver al inicio !</p>
          <p className="small text-white">Puedes volver al inicio e intentar una busqueda nueva. !</p>
        </div>
      </Link>
    </div>
  )
}

export default BackToHome