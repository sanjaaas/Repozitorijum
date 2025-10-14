import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <button onClick={() => navigate('/kontakt')}>
        Kontaktiraj nas
      </button>
    </footer>
  );
}