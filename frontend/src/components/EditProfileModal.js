import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './EditProfileModal.css';

function EditProfileModal({ isOpen, onRequestClose, user, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ first_name: firstName, last_name: lastName, email });
    onRequestClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="edit-modal"
      overlayClassName="edit-overlay"
      ariaHideApp={false}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <h2>Izmena korisničkih podataka</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <label>
            Ime:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Prezime:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div className="edit-buttons">
            <button type="submit">Sačuvaj</button>
            <button type="button" onClick={onRequestClose}>Otkaži</button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}

export default EditProfileModal;