import React, { useState, useEffect } from 'react';
import './HomePage.css';
import SearchBox from '../SearchBox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Credentials from '../Credentials/Credentials';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const HomePage = () => {
  const [credentialsList, setCredentialsList] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState(sessionStorage.getItem('email'));

  const fetchCredentialsList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/credentials/${email}`
      );
      const credentialsData = response.data;
      setCredentialsList(credentialsData);
    } catch (error) {
      enqueueSnackbar('Error fetching credentials', { variant: 'error' });
    }
  };

  const handleAddCredentials = async () => {
    navigate('/add-credentials');
  };

  return (
    <div id='home-page'>
      <div id='main-background'></div>
      <SearchBox credentialsList={credentialsList} setCredentialsList={setCredentialsList} fetchCredentialsList={fetchCredentialsList} />
      <div id='credentials-list'>
      <AddToPhotosIcon id='add-credentials-icon' onClick={handleAddCredentials} />
        <div className='credentials-container'>
          {credentialsList.length > 0 &&
            credentialsList.map((credentials) => (
              <Credentials key={credentials._id} credentials={credentials} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
