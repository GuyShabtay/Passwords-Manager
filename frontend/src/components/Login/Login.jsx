import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSnackbar } from 'notistack';
import loader from '../../assets/images/loader.gif';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      return;
    } else if (!email || !password) {
      enqueueSnackbar('All fields are required', { variant: 'error' });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('userName', response.data.userName);
      sessionStorage.setItem('email', email);
      navigate('/home-page');
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        enqueueSnackbar(error.response.data.error, { variant: 'error' });
      } else {
        enqueueSnackbar('Error logging in', { variant: 'error' });
      }
    }
    setLoading(false);
  };

  return (
    <div id='login'>
    <div id='login-box'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn-secondary" type="submit">Submit</button>
      </form>
      <div className='account-question'>
        <span>Don't have an account?</span>
        <Link to="/register" id="register-btn">Register</Link>
      </div>
      {loading && (<img src={loader} id='loader' alt='Loading...' />)}
    </div>
    </div>
  );
};

export default Login;
