import React, { useState } from 'react';
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
 import '../Login1/Login.css'
 import lock from '../../assets/images/pc.jpg';
 import '../Login1/Login.css'



const AddCredentials = () => {
  const [category, setCategory] = useState('');
  const [websites, setWebsites] = useState([{ name: '', password: '' }]);
  const [loading, setLoading] = useState(false);
   const [websiteName, setWebsiteName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const addWebsiteField = () => setWebsites([...websites, { name: '', password: '' }]);
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
  console.log('first,userId',userId)
  if (!userId) {
    enqueueSnackbar('User not logged in', { variant: 'error' });
    setLoading(false);
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/credentials/${userId}`, {
      category,
      websites, // array of { name, password }
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
      <button className="btn-primary btn-back" onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon />
      </button>

     
    <div id="login-container" >

      <div id="login-box">
              
      
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
      </div>

      {/* Password */}
      <div className="input-container password">
        <input
          required
          className="input"
          type="password"
          placeholder="Password"
          value={item.password}
          onChange={(e) => handleWebsiteChange(index, "password", e.target.value)}
        />
        <label className="password-label">Password</label>
      </div>

      {/* Add / Remove buttons */}
      <div className="website-buttons">
        <button
          type="button"
          className="add-btn"
          onClick={addWebsiteField}
        >
          +
        </button>

        {websites.length > 1 && (
          <button
            type="button"
            className="remove-btn"
            onClick={() => removeWebsiteField(index)}
          >
            -
          </button>
        )}
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
