import React from 'react'
import './../sass/containers/layout.scss'

export function layout ({ children }) {
  return (
    <div className="Layout">
      <div>Trololo</div>
      <div className="container">
        { children }
      </div>
    </div>
  )
}