import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/books', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setBooks(res.data))
    .catch(() => setBooks([]));
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setBooks(prev => prev.filter(book => book.id !== id)))
    .catch(() => alert('Greška pri brisanju.'));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📚 Admin panel</h2>
      <p>Ukupno knjiga: {books.length}</p>

      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => alert('Uređivanje još nije implementirano')}>Uredi</button>
              <button onClick={() => handleDelete(book.id)} style={{ backgroundColor: '#cc0000' }}>Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;