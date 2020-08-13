import React from 'react';
import './sass/containers/layout.scss'
import './sass/utils.scss'
import './sass/common/_variables.scss'

import { RenderRoutes } from './router';
import Topbar from './components/topbar'

function App() {
  return (
    <>
    <Topbar />
    <div className="Layout">
      <div className="container">
        <RenderRoutes />
      </div>
    </div>
    </>
  );
}

export default App;
