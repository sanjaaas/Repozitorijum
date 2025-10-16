import React, { useState, useEffect } from 'react';
import './AuthModal.css';

export default function ResetPasswordModal({ token, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!newPassword.trim()) {
      setError('Unesite novu lozinku');
      setStatus('');
      return;
    }

    try {
      const res = await fetch(`api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(data.message || 'Lozinka je uspešno resetovana');
        setError('');
      } else {
        setError(data.error || 'Greška pri resetovanju lozinke');
        setStatus('');
      }
    } catch (err) {
      console.error('Greška:', err);
      setError('Greška pri komunikaciji sa serverom');
      setStatus('');
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="auth-modal-overlay"
      onClick={() => typeof onClose === 'function' && onClose()}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Nova lozinka</h2>
        <input
          type="password"
          placeholder="Unesite novu lozinku"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}
        {status && <p className="auth-success">{status}</p>}
        <button onClick={handleSubmit}>Potvrdi</button>
      </div>
    </div>
  );
}