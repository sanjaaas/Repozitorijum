import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './ChangePasswordModal.css';
import axios from 'axios';

function ChangePasswordModal({ isOpen, onRequestClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('Popunite sva polja');
      setStatus('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://127.0.0.1:5000/api/change-password',
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(res.data.message || 'Lozinka je uspešno promenjena');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Greška pri promeni lozinke';
      setError(msg);
      setStatus('');
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onRequestClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onRequestClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="change-modal"
      overlayClassName="change-overlay"
      ariaHideApp={false}
    >
      <h2>Promena lozinke</h2>
      <form onSubmit={handleSubmit} className="change-form">
        <label>
          Trenutna lozinka:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nova lozinka:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="change-error">{error}</p>}
        {status && <p className="change-success">{status}</p>}
        <div className="change-buttons">
          <button type="submit">Sačuvaj</button>
          <button type="button" onClick={onRequestClose}>Otkaži</button>
        </div>
      </form>
    </ReactModal>
  );
}

export default ChangePasswordModal;