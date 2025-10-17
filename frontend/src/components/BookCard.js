import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

function BookCard({ book }) {
  const navigate = useNavigate();
  const bookId = book.id || book._id;

  const imageSrc = book.image_url?.startsWith('/')
    ? book.image_url
    : book.image_url;

  return (
    <div className="book-card" onClick={() => navigate(`/books/${bookId}`)}>
      <div className="book-image-wrapper">
        <img
          src={imageSrc}
          alt={book.title}
          className="book-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/220x260?text=Slika+nije+nađena';
          }}
        />
        {book.is_recommended && (
          <span className="badge-recommended">Preporučeno</span>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>

        {book.is_on_sale && book.sale_price ? (
          <p className="book-price">
            <span className="sale-price">{book.sale_price} RSD</span>{' '}
            <span className="original-price">{book.price} RSD</span>
          </p>
        ) : (
          <p className="book-price">{book.price} RSD</p>
        )}
      </div>
    </div>
  );
}

export default BookCard;