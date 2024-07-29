import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import loader from '../assets/images/loader.gif';

export default function SearchBox({credentialsList,setCredentialsList,fetchCredentialsList}) {
  const [website, setWebsite] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(sessionStorage.getItem('email'));

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/credentials', {
        params: { email, website }
      });
  
      setCredentialsList(response.data); 
    } catch (error) {
      enqueueSnackbar('Website does not exist in the system', { variant: 'error' });
      setCredentialsList([]); 
    }
    setLoading(false);
  };
  
  

  useEffect(() => {
    if(website==='')
      fetchCredentialsList();
    else
    handleSearch()
  }, [website]);

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', color: 'black' }}>
        <SearchIcon sx={{ color: 'black', mr: 1, my: 0.5, fontSize: 35 }} />
        <TextField 
          id="input-with-sx" 
          label="Search a website" 
          variant="standard" 
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          InputProps={{ style: { fontSize: 20 } }} 
          InputLabelProps={{ style: { fontSize: 20 } }} 
        />
       {/*  <button className='btn-primary' onClick={handleSearch} style={{margin:'0 0 0 15px',alignSelf: 'flex-end', padding:'5px 15px'}}><SearchIcon/></button> */}
      </Box>
      {loading && <img src={loader} id='loader' />}
    </Box>
  );
}
