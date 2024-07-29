import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import loader from '../../assets/images/loader.gif';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar('Invalid email address', { variant: 'error' });
    } else if (password !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
    } else {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:8000/api/register', {
          userName,
          email,
          password
        });

        if (response.status === 200) {
          enqueueSnackbar('Successfully created a user', { variant: 'success' });
          navigate('/login');
        }
      } catch (error) {
        if (error.response && error.response.data) {
          enqueueSnackbar(error.response.data.error, { variant: 'error' });
        } else {
          enqueueSnackbar('Error creating a user', { variant: 'error' });
        }
      }
      setLoading(false);
    }
  };

  return (
    <div id='register'>
    <div id='register-box'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userName">Full Name</label>
        <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
        <button className="btn-secondary" type="submit">Submit</button>
      </form>
      <div className='account-question'>
        <span>Already have an account?</span>
        <Link to="/login" id='login-btn'>Login</Link>
      </div>
      {loading && <img src={loader} id='loader' alt='Loading...' />}
    </div>
    </div>
  );
};

export default Register;
