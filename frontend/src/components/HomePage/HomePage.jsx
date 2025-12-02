import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Credentials from '../Credentials/Credentials';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import TabsSwitcher from '../TabsSwitcher/TabsSwitcher';
import { Button, Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';



const HomePage = () => {
  const [credentialsList, setCredentialsList] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState(sessionStorage.getItem('email'));

  

  const handleAddCredentials = async () => {
    navigate('/add-credentials');
  };

  return (
    <div id='home-page'>
      
      <TabsSwitcher />
       <Button className="submit-btn" onClick={handleAddCredentials}>
                    <span ><AddRoundedIcon className='add-icon'/></span>
                  </Button>

    </div>
  );
};

export default HomePage;
