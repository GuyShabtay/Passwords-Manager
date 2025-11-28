import React from 'react';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AddCredentials from './components/AddCredentials/AddCredentials';
import EditCredentials from './components/EditCredentials';
import Layout from './components/Layout';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './App.css';
// import LoginPage from './components/LoginPage';
import FullApp from './components/FullApp';
import './index.scss'
import MaterialLogin from './components/MaterialLogin';
// import TabsSwitcherDemo from './components/TabsSwitcherDemo';
import TabsSwitcher1 from './components/TabsSwitcher1'
import Auth from './components/Auth/Auth'

const App = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <Auth />,
    },
    {
      path: '/login',
      element: <Auth />,
    },
    {
      path: '/register',
      element: <Layout><Register /></Layout>,
    },
    {
      path: '/home-page',
      element: <Layout><HomePage /></Layout>,
    },
    {
      path: '/add-credentials',
      element: <Layout><AddCredentials /></Layout>,
    },
    {
      path: '/edit-credentials',
      element: <Layout><EditCredentials /></Layout>,
    },
    // {
    //   path: '/login-page',
    //   element: <Layout><LoginPage /></Layout>,
    // },
  ]);

  return (
    <div id='app'>
      <div id='main-background'></div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
