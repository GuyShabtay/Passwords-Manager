import React, { useState,useRef  } from 'react';
import './AddCredentials.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import loader from '../../assets/images/loader.gif';


import { Button, Box } from '@mui/material';
import loginIcon from '../../assets/images/form.png';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import submitIcon from '../../assets/images/login.png';
 import '../Login/Login.css'
 import lock from '../../assets/images/pc.jpg';
 import '../Login/Login.css'
 import Lottie from "lottie-react";
import addAnimation from "../../assets/animations/add.json";
import deleteAnimation from "../../assets/animations/delete.json";
import LanguageIcon from '@mui/icons-material/Language';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';




const AddCredentials = () => {
  const createLottieRef = () => React.createRef();

  const [category, setCategory] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
const [websites, setWebsites] = useState([
  { name: "", password: "", addRef: createLottieRef(), deleteRef: createLottieRef() }
]);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

const addWebsiteField = () => {
  setWebsites([
    ...websites,
    { name: "", password: "", addRef: createLottieRef(), deleteRef: createLottieRef() }
  ]);
};
  const removeWebsiteField = (index) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const handleWebsiteChange = (index, field, value) => {
    const updated = [...websites];
    updated[index][field] = value;
    setWebsites(updated);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!category || websites.some((w) => !w.name.trim() || !w.password.trim())) {
    enqueueSnackbar('All fields are required', { variant: 'error' });
    return;
  }

  setLoading(true);

  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    enqueueSnackbar('User not logged in', { variant: 'error' });
    setLoading(false);
    return;
  }

  try {
   const payloadWebsites = websites.map(({ name, password }) => ({ name, password }));

await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/credentials/${userId}`, {
  category,
  websites: payloadWebsites,
});
    enqueueSnackbar('Credentials added successfully', { variant: 'success' });
    navigate(-1);
  } catch (error) {
    enqueueSnackbar(error.response?.data?.error || 'Error adding credentials', { variant: 'error' });
  }

  setLoading(false);
};


  return (
    <div id="add-credentials">
      <Button type="button" className="back-btn" onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon />
                          </Button>
      <h1>Add Credentials</h1>
    <div id="login-container" >
      <div id="login-box">
              <img id="login-icon" src={loginIcon} alt="" />
              <Box dir="ltr">
                <form onSubmit={handleSubmit} className="form-box">
                  <div className="input-container username">
                    <input
                      required
                      className="input"
                      type="text"
                      name="username"
                      id="username-field"
                      placeholder="Category"
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'Category')}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <label className="usernameLabel" htmlFor="username-field">Category</label>
      
                    <svg viewBox="0 0 448 512" className="userIcon" aria-hidden>
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                    </svg>
                  </div>

                 <div className="websites-list">
  {websites.map((item, index) => (
    <div className="website-row" key={index}>
      
      {/* Website name */}
      <div className="input-container username">
        <input
          required
          className="input"
          type="text"
          placeholder="Website name"
          value={item.name}
          onChange={(e) => handleWebsiteChange(index, "name", e.target.value)}
        />
        <label className="usernameLabel">Website name</label>
        
        <svg viewBox="0 0 500 512" className="userIcon website-icon" aria-hidden>
         <LanguageIcon />
                      </svg>
      </div>

      {/* Password */}
      <div className="input-container password">
        <input
          required
          className="input"
          id="password-field"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={item.password}
          onChange={(e) => handleWebsiteChange(index, "password", e.target.value)}
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
     

      {/* Add / Remove buttons */}
      <div className="website-buttons">

         <button
  style={{ background: "transparent", border: "none", cursor: "pointer" }}
  onClick={addWebsiteField}
  onMouseEnter={() => item.addRef.current.play()}
  onMouseLeave={() => item.addRef.current.stop()}
>
  <Lottie
    lottieRef={item.addRef}
    animationData={addAnimation}
    loop={false}
    autoplay={false}
    style={{ width: 50, height: 50 }}
  />
</button>

<button
  disabled={websites.length === 1}              // disable if only one row
  onClick={() => removeWebsiteField(index)}
  onMouseEnter={() => {
    if (websites.length > 1) item.deleteRef.current.play();
  }}
  onMouseLeave={() => {
    if (websites.length > 1) item.deleteRef.current.stop();
  }}
  style={{
    background: "transparent",
    border: "none",
    cursor: websites.length === 1 ? "not-allowed" : "pointer",
    opacity: websites.length === 1 ? 0.3 : 1,   // gray out
  }}
>
  <Lottie
    lottieRef={item.deleteRef}
    animationData={deleteAnimation}
    loop={false}
    autoplay={false}
    style={{ width: 50, height: 50 }}
  />
</button>

      </div>
    </div>
  ))}
</div>
                  <Button className="submit-btn" type="submit">
                    <span className="btn-text">Submit</span>
                    <img id="submit-icon" src={submitIcon} alt="icon" />
                  </Button>
                </form>
              </Box>
              </div>
              <img id="lock" src={lock} alt="" />
              </div>
              
    </div>
  );
};

export default AddCredentials;
