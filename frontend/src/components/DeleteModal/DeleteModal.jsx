import React from 'react';
import './DeleteModal.css'

const DeleteModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }
  const handleBackgroundClick = (e) => {
    if (e.target.id === 'delete-modal') {
      onClose();
    }
  };
  return (
    <div id="delete-modal" onClick={handleBackgroundClick}>
      <div id="delete-modal-content">
      <div id='delete-validation-text'>Are you sure you want to delete these credentials?</div>
        <div id="delete-modal-buttons">
        <button className='btn-secondary'  onClick={onClose}>Cancel</button>
        <button className='btn-secondary' id='btn-delete' onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
