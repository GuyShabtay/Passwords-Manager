import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/logo.png';
import logoImage from '../../assets/images/password.png';

const Navbar = () => {
  const [userName, setUserName] = useState(sessionStorage.getItem('userName'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (userName) {
      sessionStorage.clear();
      setUserName(null);
      navigate('/login');
    }
  };

  const showUserName =
    !location.pathname.includes('/login') &&
    !location.pathname.includes('/register');

  return (
    <div id='navbar'>
      <div id='logo'>
        <img src={logoImage} alt='Logo Icon' id='logo-icon' />
        <img src={logo} alt='Logo Text' id='logo-text' />
      </div>
      {showUserName && userName &&
        <>
         <p>Hi, {userName}</p>
      <div>
        <button className='btn-secondary' onClick={handleLogout}>
          Log out
        </button>
      </div>
      </>}
    </div>
  );
};

export default Navbar;
