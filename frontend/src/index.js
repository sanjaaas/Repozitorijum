import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './index.css'; // obavezno, iako je prazan na početku

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppRoutes />);