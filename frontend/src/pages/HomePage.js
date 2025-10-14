import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import CategoryModal from '../components/CategoryModal'
import axios from 'axios';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const categories = ['Popularna psihologija', 'Roman', 'Klasici', 'Istorijski roman', 'Deca'];

  const handleCategorySelect = (category) => {
    navigate('/books', {
      state: {
        tags: [category]
      }
    });
    setShowModal(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate('/books', {
        state: { search: searchTerm }
      });
    }
  };
  const handleInputChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim().length > 1) {
    axios
      .get(`http://127.0.0.1:5000/api/books?query=${value}`)
      .then(res => setSuggestions(res.data))
      .catch(err => console.error('Greška:', err));
  } else {
    setSuggestions([]);
  }
};

  return (
    <div className="home-container">
      <Header />

      <div className="home-main">
        <div className="carousel-wrapper">
          <Carousel />
        </div>

        <div className="search-promo">
          <img src="/logo.png" alt="Logo" className="site-logo" />

          {/* grupa: input + pretraži dugme */}
          <div className="search-group">
           <input
              type="text"
              placeholder="Pretraži knjige..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            {suggestions.length > 0 && (
                      <ul className="suggestion-list">
            {suggestions.map(book => {
              const imageSrc = book.image_url?.startsWith('/')
                ? `http://127.0.0.1:5000${book.image_url}`
                : book.image_url;

              return (
                <li key={book.id} onClick={() => navigate(`/books/${book.id}`)} className="suggestion-item">
                  <img src={imageSrc} alt={book.title} className="suggestion-thumb" />
                  <div className="suggestion-text">
                    <strong>{book.title}</strong>
                    <span>{book.author}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          )}
          
            <button className="search-btn" onClick={handleSearch}>
              Pretraga
            </button>
          </div>

          {/* promo dugmad odmah ispod */}
          <div className="promo-buttons under-search">
            <PromoBanner
              onSve={() => navigate('/books')}
              onKategorije={() => setShowModal(true)}
              onAkcija={() =>
                navigate('/books', {
                  state: { tags: ['Akcija'] }
                })
              }
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal za kategorije */}
      {showModal && (
        <CategoryModal
          categories={categories}
          onSelect={handleCategorySelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}