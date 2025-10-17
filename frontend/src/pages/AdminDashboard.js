import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddBookModal from '../components/AddBookModal';
import EditBookModal from '../components/EditBookModal';
import DeleteBookModal from '../components/DeleteBookModal';
import './AdminDashboard.css';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBooks = () => {
    axios.get('/api/books', { headers })
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  };

  useEffect(() => {
    fetchBooks();

    axios.get('/api/admin/stats', { headers })
      .then(res => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="admin-page">
      <Header />

      <div className="admin-wrapper">
        <div className="admin-window">
          <div className="admin-header-row">
            <div className="admin-header-left">
              <h2>Admin panel</h2>
              <p className="admin-stats">Ukupno knjiga: {books.length}</p>
              <button className="add-book-btn" onClick={() => setShowAddModal(true)}>
                + Dodaj novu knjigu
              </button>
            </div>

            <div className="admin-header-right">
              <div className="admin-stats-card">
                <h3>Statistika</h3>
                {!stats ? (
                  <p>Učitavanje...</p>
                ) : (
                  <>
                    <p><strong>Korisnici:</strong> {stats.user_count}</p>
                    <p><strong>Porudžbine:</strong> {stats.order_count}</p>
                    <p><strong>Ukupan prihod:</strong> {stats.total_revenue} RSD</p>
                    <h4>Najprodavanije knjige:</h4>
                    <ul>
                      {stats.top_books.map((book, i) => (
                        <li key={i}>{book.title} — {book.sold} kom</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {books.length === 0 ? (
            <p className="no-books-msg">Nema dostupnih knjiga.</p>
          ) : (
            <div className="book-grid">
              {books.map(book => {
                const imageSrc = book.image_url?.startsWith('/')
                  ? book.image_url
                  : '/static/images/${book.image_url}';

                return (
                  <div key={book.id} className="book-card" onClick={() => navigate(`/admin/book/${book.id}`)}>
                    <img src={imageSrc} alt={book.title} className="book-image" />
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <div className="book-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(book);
                      }}>✏️ Uredi</button>
                      <button className="delete-btn" onClick={(e) => {
                        e.stopPropagation();
                        setBookToDelete(book);
                      }}>🗑️ Obriši</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onBookAdded={fetchBooks}
        />
      )}

      {selectedBook && (
        <EditBookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onBookUpdated={fetchBooks}
        />
      )}

      {bookToDelete && (
        <DeleteBookModal
          book={bookToDelete}
          onClose={() => setBookToDelete(null)}
          onBookDeleted={(id) => {
            setBooks(prev => prev.filter(b => b.id !== id));
            setBookToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;