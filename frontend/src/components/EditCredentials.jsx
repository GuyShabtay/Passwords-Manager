import React, { useState, useEffect } from 'react';
import './AddCredentials/AddCredentials.css';  
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import loader from '../assets/images/loader.gif';

const EditCredentials = () => {
  const location = useLocation();
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(sessionStorage.getItem('email'));


  useEffect(() => {
    if (location.state?.credentials) {
      const { website, password } = location.state.credentials;
      setWebsite(website || '');
      setPassword(password || '');
    }
  }, [location.state?.credentials]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!website || !password) {
      enqueueSnackbar('All fields are required', { variant: 'error' });
      return;
    }
    setLoading(true);
    const formData = { email, website, password };

    try {
      const response = await axios.put(
        `http://localhost:8000/api/credentials/${location.state.credentials.id}`,
        formData
      );
      enqueueSnackbar('Credentials updated successfully', { variant: 'success' });
      navigate(-1);
    } catch (error) {
      if (error.response && error.response.data) {
        enqueueSnackbar(error.response.data.error, { variant: 'error' });
      } else {
        enqueueSnackbar('Error updating credentials', { variant: 'error' });
      }
    }
    setLoading(false);
  };

  return (
    <div id='add-credentials'>
      <button className='btn-primary btn-back' onClick={() => navigate(-1)}>
        <KeyboardBackspaceIcon />
      </button>
      <div id='add-credentials-box'>
        <h1>Edit credentials</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='website'>Website:</label>
            <input
              id='website'
              type='text'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input
              id='password'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn-secondary'>
            Submit
          </button>
        </form>
      </div>
      {loading && <img src={loader} id='loader' alt='Loading...' />}
    </div>
  );
};

export default EditCredentials;
