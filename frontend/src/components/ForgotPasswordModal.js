import React, { useState } from 'react';
import './AuthModal.css';

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Unesite email adresu');
      setStatus('');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.message || 'Link za reset lozinke je poslat');
        setError('');

        if (data.reset_token) {
         
          setTimeout(() => {
            onClose();
            window.location.href = `/reset-password/${data.reset_token}`;
          }, 1200); 
        }
      } else {
        setError(data.error || 'Greška pri slanju zahteva');
        setStatus('');
      }
    } catch (err) {
      console.error('Greška:', err);
      setError('Greška pri komunikaciji sa serverom');
      setStatus('');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Reset lozinke</h2>
        <input
          type="email"
          placeholder="Unesite email adresu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}
        {status && <p className="auth-success">{status}</p>}
        <button onClick={handleSubmit}>Pošalji zahtev</button>
      </div>
    </div>
  );
}