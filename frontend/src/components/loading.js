import React from 'react';
import '../sass/components/loading.scss'

const Loading = () => {
  return (
    <div className="Loading">
      <div className="padding-y-1 bubble bubble--highlight bubble--loading cursor-pointer">
        <p className="big margin-y-0">Loading !</p>
      </div>
    </div>
  )
}

export default Loading