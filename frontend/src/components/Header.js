import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthModal from './AuthModal';

function Header() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [fadeState, setFadeState] = useState('fade-in');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setFadeState('fade-out');

    axios.get('http://127.0.0.1:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
      .then(res => {
        setUser(res.data);
        setFadeState('fade-in');
      })
      .catch(err => {
        console.error("Greška pri dohvatanju korisnika:", err.response);
        setUser(null);
        setFadeState('fade-in');
      });
  }, []);

  const handleLogout = () => {
    setFadeState('fade-out');
    localStorage.clear();
    setUser(null);
    navigate('/');
    setFadeState('fade-in');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ccc'
      }}
    >
      {/* Logo u levom uglu */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo_plavi.png"
          alt="LogoPlavi"
          style={{
            height: '40px',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
        />
      </Link>

      {/* Navigacija u desnom delu */}
      <div>
        {!user ? (
          <>
            <button
              className={`header-btn ${fadeState}`}
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
            >
              Prijava
            </button>
            <button
              className={`header-btn ${fadeState}`}
              onClick={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
            >
              Registracija
            </button>
          </>
        ) : user.is_admin ? (
          <>
            <Link to="/admin" className={`header-btn ${fadeState}`}>Admin panel</Link>
            <button onClick={handleLogout} className={`header-btn ${fadeState}`}>Odjava</button>
          </>
        ) : (
          <>
            <Link to="/cart" className={`header-btn ${fadeState}`}>Korpa</Link>
            <Link to="/wishlist" className={`header-btn ${fadeState}`}>Lista želja</Link>
            <Link to="/profile" className={`header-btn ${fadeState}`}>Moj profil</Link>
            <button onClick={handleLogout} className={`header-btn ${fadeState}`}>Odjava</button>
          </>
        )}
      </div>

      {/* Modal za prijavu/registraciju */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
}

export default Header;