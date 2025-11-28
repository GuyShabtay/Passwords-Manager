import React, { useState } from 'react';
import './AddCredentials.css';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import loader from '../../assets/images/loader.gif';

const AddCredentials = () => {
  const [category, setCategory] = useState('');
  const [websites, setWebsites] = useState([{ name: '', password: '' }]);
  const [loading, setLoading] = useState(false);

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

      <div id="add-credentials-box">
        <h1>Add Credentials</h1>
        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          {/* Websites with passwords */}
          <div className="form-group">
            <label>Websites & Passwords:</label>
            {websites.map((site, index) => (
              <div key={index} className="website-row">
                <input
                  type="text"
                  value={site.name}
                  placeholder="Website or company name"
                  onChange={(e) => handleWebsiteChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="text"
                  value={site.password}
                  placeholder="Password"
                  onChange={(e) => handleWebsiteChange(index, 'password', e.target.value)}
                  required
                />
                {websites.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeWebsiteField(index)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addWebsiteField}>
              + Add website
            </button>
          </div>

          <button type="submit" className="btn-secondary">
            Submit
          </button>
        </form>
      </div>

      {loading && <img src={loader} id="loader" alt="Loading..." />}
    </div>
  );
};

export default AddCredentials;
