import React from 'react';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AddCredentials from './components/AddCredentials/AddCredentials';
import EditCredentials from './components/EditCredentials';
import Layout from './components/Layout';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './App.css';

const App = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout><Login /></Layout>,
    },
    {
      path: '/login',
      element: <Layout><Login /></Layout>,
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
  ]);

  return (
    <div id='app'>
      <div id='main-background'></div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
