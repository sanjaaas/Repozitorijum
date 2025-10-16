import React from 'react';
import axios from 'axios';
import './DeleteBookModal.css';

function DeleteBookModal({ book, onClose, onBookDeleted }) {
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBookDeleted(book.id);
      onClose();
    } catch (err) {
      console.error('Greška pri brisanju knjige:', err.response?.data || err.message);
      alert('Brisanje nije uspelo.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>Brisanje knjige</h3>
        <p>Da li ste sigurni da želite da obrišete knjigu <strong>{book.title}</strong>?</p>
        <div className="modal-actions">
          <button onClick={handleDelete}>Obriši</button>
          <button onClick={onClose}>Otkaži</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBookModal;