import React, { useState, useEffect } from 'react';
import "../Login1/Login.css"; 
import submitIcon from "../../assets/images/login.png";
import loginIcon from '../../assets/images/account.png';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import secure from '../../assets/images/secure.jpg';
import EmailIcon from '@mui/icons-material/Email';

// interface AttachFilesProps {
//  setShowRegister:any;
// }
// const Login = () => {
  const Register = ({ setShowRegister }) => {
   const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(''); // NEW

  // const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password || !confirmPassword) {
      enqueueSnackbar('All fields are required', { variant: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        userName,
        email, // NEW
        password
      });

      if (response.status === 200) {
        enqueueSnackbar('Successfully created a user', { variant: 'success' });
        setShowRegister(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        enqueueSnackbar(error.response.data, { variant: 'error' });
      } else {
        enqueueSnackbar('Error creating a user', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
        // <div id="login">
            <div id="register-container">

    <div id="login-box">
      
        <img id="login-icon" src={loginIcon} alt="" />

      <form className="form-box" onSubmit={handleSubmit}>

        {/* USERNAME */}
        <div className="input-container username">
          <input
            required
            type="text"
            id="reg-username"
            className="input"
            placeholder="Username"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Username")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label className="usernameLabel" htmlFor="reg-username">Username</label>
          <svg viewBox="0 0 448 512" className="userIcon">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
          </svg>
        </div>

     
  {/* EMAIL */}
       


                <div className="input-container username">
                        <input
                          required
                          className="input"
                          type="email"
                          name="username"
                          id="username-field"
                          placeholder="Email"
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'Email')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="usernameLabel" htmlFor="username-field">Email</label>
          <svg viewBox="0 0 500 512" className="userIcon" aria-hidden>
          <EmailIcon className='email-icon'/>  
                        </svg>
                      </div>


        {/* PASSWORD */}
        <div className="input-container password">
          <input
            required
            type="password"
            className="input"
            placeholder="Password"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="password-label">Password</label>
         <svg viewBox="0 0 448 512" className="password-icon" aria-hidden>
                <path d="M400 192h-24v-72C376 53.8 322.2 0 256 0S136 53.8 136 120v72H112c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48zM184 120c0-39.8 32.2-72 72-72s72 32.2 72 72v72H184V120z"/>
              </svg>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="input-container password">
          <input
            required
            type="password"
            className="input"
            placeholder="Confirm Password"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Confirm Password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label className="password-label">Confirm Password</label>
          <svg viewBox="0 0 448 512" className="password-icon">
            <path d="M400 192h-24v-72C376 53.8 322.2 0 256 0S136 53.8 136 120v72H112c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48z"/>
          </svg>
        </div>

        <button type="submit" className="submit-btn">
          <span className="btn-text">Register</span>
          <img id="submit-icon" src={submitIcon} alt="" />
        </button>
      </form>
     
         <div className="one-line switch">
         <p className="switch-text" >Already have an account?</p>
          <button className="switch-btn" onClick={() => setShowRegister(false)}>
            Login
          </button>
        </div>
    </div>
   <img id="lock" src={secure} alt="" />
   </div>   

  );
};

export default Register;
