import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/logo.png';
import logoImage from '../../assets/images/password.png';
import secure from '../../assets/images/sheild1.jpg';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';



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
      <div className="navbar-logo-box one-line">
              <PasswordRoundedIcon className='navbar-password-logo'/>
              <img src={logo} alt='text logo' className='navber-text-logo' />
            </div>
      {showUserName && userName &&
        <div >
         <p className='navbar-name'>Hi, {userName}</p>
        <button className='btn-secondary' onClick={handleLogout}>
          Log out
        </button>
      </div>}
    </div>
  );
};

export default Navbar;
