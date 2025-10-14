import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import './AuthModal.css';

export default function AuthModal({ mode: initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode || 'login');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { token } = useParams();

  useEffect(() => {
    setMode(initialMode || 'login');
  }, [initialMode]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const url = mode === 'login'
      ? 'http://127.0.0.1:5000/api/login'
      : 'http://127.0.0.1:5000/api/register';

    if (!formData.email || !formData.password || (mode === 'register' && (!formData.first_name || !formData.last_name))) {
      setError("Popunite sva polja");
      return;
    }

    try {
      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('first_name', res.data.first_name);
      localStorage.setItem('last_name', res.data.last_name);
      localStorage.setItem('is_admin', res.data.is_admin);

      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Backend greška:", err.response);
      setError(err.response?.data?.error || 'Greška pri autentifikaciji');
    }
  };

  // ✅ Ako postoji token u URL-u, prikazujemo samo ResetPasswordModal
  if (token) {
    return (
      <div className="auth-modal-overlay">
        <ResetPasswordModal token={token} onClose={() => window.location.href = '/'} />
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'login' ? 'Prijava' : 'Registracija'}</h2>

        {mode === 'register' && (
          <>
            <input name="first_name" placeholder="Ime" value={formData.first_name} onChange={handleChange} />
            <input name="last_name" placeholder="Prezime" value={formData.last_name} onChange={handleChange} />
          </>
        )}

        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Lozinka" value={formData.password} onChange={handleChange} />

        {mode === 'login' && (
          <p className="forgot-password">
            <span onClick={() => setShowForgotModal(true)}>Zaboravio/la sam lozinku</span>
          </p>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button onClick={handleSubmit}>
          {mode === 'login' ? 'Prijavi se' : 'Registruj se'}
        </button>

        <p className="auth-switch">
          {mode === 'login'
            ? <>Nemate nalog? <span onClick={() => setMode('register')}>Registrujte se</span></>
            : <>Već imate nalog? <span onClick={() => setMode('login')}>Prijavite se</span></>}
        </p>

        {showForgotModal && (
          <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
        )}
      </div>
    </div>
  );
}