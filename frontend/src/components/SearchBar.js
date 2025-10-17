import React, { useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = debounce((value) => {
    axios.get(`http://localhost:5000/api/books?search=${value}`)
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  }, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== '') {
      handleSearch(value);
    } else {
      setBooks([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Pretraži knjige..."
        value={searchTerm}
        onChange={handleChange}
        style={{
          padding: '0.5rem',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '1rem'
        }}
      />

      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;