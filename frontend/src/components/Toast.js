import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Toast.css';

export default function Toast({ message, linkText, linkHref }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="toast-container">
      <div className="toast-message">{message}</div>
      {linkText && linkHref && (
        <Link to={linkHref} className="toast-link">{linkText}</Link>
      )}
    </div>
  );
}