import React from 'react';
import { Route, Switch } from 'react-router-dom';

import StudentProfile from './../pages/studentProfile';
import { Home } from './../pages/home'

export const RenderRoutes = () => {
  return (
    <Switch>
      {ROUTES.map(({ exact, key, path, redirect, component, props }) => {
        console.log(props)
        return (
          <Route
            key={key}
            exact={exact}
            component={component}
            path={path}
            redirect={redirect}
          />
        );
      })}

      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
};

// Este es un arreglo donde irán todas las rutas de nuestra App ;)
const ROUTES = [
  {
    path: '/profile/:profileName',
    key: 'PROFILEPARAMS',
    exact: false,
    component: StudentProfile,
    redirect: false,
  },
  {
    path: '/profile',
    key: 'PROFILE',
    exact: true,
    component: StudentProfile,
    redirect: false,
  },
  {
    path: '/',
    key: 'HOME',
    exact: true,
    component: Home,
    redirect: false,
  }
];

export default ROUTES;