import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

function CategoryPage() {
  const { name } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books?category=${name}`)
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  }, [name]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Kategorija: {name}</h2>
      {books.length === 0 ? (
        <p>Nema knjiga u ovoj kategoriji.</p>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;