import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import AddToCartModal from '../components/AddToCartModal';
import './BookDetails.css';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [toastData, setToastData] = useState(null);
  const [clickedButton, setClickedButton] = useState('');

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.error('Greška:', err));
  }, [id]);

  const imageSrc = book?.image_url?.startsWith('/')
    ? `http://127.0.0.1:5000${book.image_url}`
    : book?.image_url;

  const handleAdd = (target) => {
    setClickedButton(target);
    setTimeout(() => setClickedButton(''), 400);

    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (target === 'cart') {
      setShowCartModal(true);
    } else {
      handleWishlistAdd();
    }
  };

  const handleWishlistAdd = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/wishlist', {
        book_id: book.id
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setToastData({
        message: res.data.message || 'Knjiga dodata u listu želja!',
        linkText: 'Pogledaj listu želja',
        linkHref: '/wishlist'
      });
    } catch (err) {
      console.error('Greška pri dodavanju u listu želja:', err.response);
      setToastData({ message: 'Greška pri dodavanju u listu želja.' });
    }
  };

  const handleCartConfirm = async (quantity) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/cart', {
        book_id: book.id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setToastData({
        message: res.data.message || 'Knjiga dodata u korpu!',
        linkText: 'Pogledaj korpu',
        linkHref: '/cart'
      });
    } catch (err) {
      console.error('Greška pri dodavanju u korpu:', err.response);
      setToastData({ message: 'Greška pri dodavanju u korpu.' });
    }
  };

  if (!book) return null;

  return (
    <div className="book-detail-page">
      <Header />

      <div className="book-detail-wrapper">
        <div className="book-detail-window">
          <img src={imageSrc} alt={book.title} className="book-detail-image" />
          <div className="book-detail-info">
            <h2>{book.title}</h2>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Izdavač:</strong> {book.publisher}</p>
            <p><strong>Kategorija:</strong> {book.category}</p>
            <p><strong>Opis:</strong> {book.description}</p>
            {book.sale_price ? (
              <p className="book-detail-price">
                <span className="sale-price">{book.sale_price} RSD</span>
                <span className="original-price">{book.price} RSD</span>
              </p>
            ) : (
              <p className="book-detail-price">{book.price} RSD</p>
            )}
            <div className="book-detail-actions">
              <button
                className={`cart-btn ${clickedButton === 'cart' ? 'clicked' : ''}`}
                onClick={() => handleAdd('cart')}
              >
                Dodaj u korpu
              </button>
              <button
                className={`wishlist-btn ${clickedButton === 'wishlist' ? 'clicked' : ''}`}
                onClick={() => handleAdd('wishlist')}
              >
                Dodaj u listu želja
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showAuthModal && (
        <AuthModal
          mode="login"
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showCartModal && (
        <AddToCartModal
          book={book}
          onClose={() => setShowCartModal(false)}
          onConfirm={handleCartConfirm}
        />
      )}

      {toastData && (
        <Toast
          message={toastData.message}
          linkText={toastData.linkText}
          linkHref={toastData.linkHref}
        />
      )}
    </div>
  );
}