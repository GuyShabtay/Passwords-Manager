import React, { useState, useEffect } from 'react';
import './Login.css';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loginIcon from '../../assets/images/account.png';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import submitIcon from '../../assets/images/login.png';
import lock from '../../assets/images/lock.jpg';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import sheild from '../../assets/images/sheild1.jpg';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import TwoFactorAuthentication from '../TwoFactorAuthentication/TwoFactorAuthentication'
 import '../Login1/Login.css'


// interface AttachFilesProps {
//  setShowRegister:any;
// }
// const Login = () => {
  const Login= ({ setShowRegister }) => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [serverLoading, setServerLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [show2fa, setShow2fa] = useState(false);


  const navigate = useNavigate();

   useEffect(() => {
    sessionStorage.clear();

    // Wake up server
    const wakeUpServer = async () => {
      try {
        // await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/wakeup`); 
        // enqueueSnackbar('Server is awake!', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar('Failed to wake up server', { variant: 'error' });
      } finally {
        setServerLoading(false);
      }
    };

    wakeUpServer();
  }, []);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userName || !password) {
    enqueueSnackbar('All fields are required', { variant: 'error' });
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/login`,
      {
        userName,
        password
      }
    );
console.log('response.data.userName',response.data.userName)
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('userName', response.data.userName);
    sessionStorage.setItem('userId', response.data.userId);
    setShow2fa(true)
    // navigate('/home-page');
    // window.location.reload();
  } catch (error) {
    if (error.response && error.response.data) {
      enqueueSnackbar(error.response.data.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Error logging in', { variant: 'error' });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    // <div id="login">
    <div id="login-container" >
      <div id="login-box" style={{opacity:show2fa ? '0' : '100%'}}>
        

        <img id="login-icon" src={loginIcon} alt="" />

        {/* make the box LTR */}
        <Box dir="ltr">
          <form onSubmit={handleSubmit} className="form-box">

            {/* USERNAME INPUT - uses left-side person icon */}
            <div className="input-container username">
              <input
                required
                className="input"
                type="text"
                name="username"
                id="username-field"
                placeholder="Username"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Username')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label className="usernameLabel" htmlFor="username-field">Username</label>

              <svg viewBox="0 0 448 512" className="userIcon" aria-hidden>
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
              </svg>
            </div>

            {/* PASSWORD INPUT (unchanged behavior) */}
            <div className="input-container password">
              <input
                required
                className="input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password-field"
                placeholder="Password"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="password-label" htmlFor="password-field">Password</label>

              <svg viewBox="0 0 448 512" className="password-icon" aria-hidden>
                <path d="M400 192h-24v-72C376 53.8 322.2 0 256 0S136 53.8 136 120v72H112c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48zM184 120c0-39.8 32.2-72 72-72s72 32.2 72 72v72H184V120z"/>
              </svg>

              <div onClick={() => setShowPassword(!showPassword)} className="eye-box">
                <VisibilityIcon className={`eye-icon ${showPassword ? 'visible' : 'hidden'}`} />
                <VisibilityOffIcon className={`eye-slash-icon ${showPassword ? 'hidden' : 'visible'}`} />
              </div>
            </div>

            <Button className="submit-btn" type="submit">
              <span className="btn-text">Login</span>
              <img id="submit-icon" src={submitIcon} alt="icon" />
            </Button>
          </form>
        </Box>
         <div className="one-line switch">
         <p className="switch-text" >Need to register?</p>
          <button className="switch-btn" onClick={() => setShowRegister(true)}>
            Register
          </button>
        </div>
        <Button type="button" className="twofa-resend-btn" onClick={() => setShow2fa(true)}>
<span class="material-symbols-outlined">id_card</span>
                      Enter as a guest
                    </Button>
        
         {serverLoading && (
          <div className='server-status'>
            <p>Waking up the server, please wait...</p>
            <div className="loader"></div>
          </div>
        )}
        
        </div>
       <img id="lock" src={lock} alt="" />
         {/*<img id="lock" src={lock} alt="" />*/}
         {show2fa && <TwoFactorAuthentication/>}
     </div>
  );
};

export default Login;
