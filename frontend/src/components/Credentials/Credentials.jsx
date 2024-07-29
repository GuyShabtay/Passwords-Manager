import React,{useState,useEffect} from 'react';
import './Credentials.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from '../DeleteModal/DeleteModal';
import { useSnackbar } from 'notistack';
import loader from '../../assets/images/loader.gif';

const Credentials = ({ credentials }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(sessionStorage.getItem('email'));


  useEffect(() => {
    if (isDelete) {
      handleDelete();
    }
  }, [isDelete]);


  const handleDelete = async () => {
    try {
      setLoading(true);
      const response= await axios.delete(`http://localhost:8000/api/credentials/${credentials.id}`, {
        params: { email } 
      });
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      enqueueSnackbar('Error deleting credentials:', { variant: 'error' });
    }
    setLoading(false);
  };
  

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    navigate('/edit-credentials', { state: { credentials } });
  };
  return (
    <div id='credentials'>
      <ul>
        <li><strong>Website:</strong> {credentials.website}</li>
        <li><strong>Password:</strong> {credentials.password}</li>
        </ul>
        <div id="edit-delete-buttons">
        <button onClick={handleEdit} className='btn-secondary btn-icons' id='edit-icon'>
          <EditIcon />
        </button>
        <button onClick={handleDeleteClick} className='btn-secondary btn-icons' id='delete-icon'>
          <DeleteIcon/>
        </button>
        </div>
        <DeleteModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
      />
      {loading && <img src={loader} id='loader' />}

    </div>
  );
};

export default Credentials;
