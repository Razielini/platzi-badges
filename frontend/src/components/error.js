import React from 'react';
import '../sass/components/error.scss'

const Error = () => {
  return (
    <div className="Error">
      <div className="padding-y-1 bubble bubble--highlight bubble--error cursor-pointer">
        <p className="big margin-y-0">Error !</p>
        <p className="small text-white">Ha ocurrido un error por favor, intentelo más tarde. !</p>
      </div>
    </div>
  )
}

export default Error