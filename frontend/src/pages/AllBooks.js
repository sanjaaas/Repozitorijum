import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AllBooks.css';

function AllBooks() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [priceRangeTemp, setPriceRangeTemp] = useState(0);
  const searchTerm = location.state?.search || '';

  useEffect(() => {
    if (location.state?.tags) {
      setActiveTags(location.state.tags);
    }
  }, [location.state]);

  const formatPriceTag = (value) => `Cena do ${value} RSD`;

  const onPriceConfirm = () => {
    setPriceRange([0, priceRangeTemp]);
    const newTags = activeTags.filter(tag => !tag.startsWith('Cena do '));
    setActiveTags([...newTags, formatPriceTag(priceRangeTemp)]);
  };

  const resetFilters = () => {
    setActiveTags([]);
    setPriceRange([0, 10000]);
    setPriceRangeTemp(0);
  };

  const toggleTag = (tag) => {
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setActiveTags(prev => prev.filter(t => t !== tag));
    if (tag.startsWith('Cena do ')) {
      setPriceRange([0, 10000]);
      setPriceRangeTemp(0);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) {
      query.append('query', searchTerm);
    }

    if (activeTags.includes('Akcija')) {
      query.append('on_sale', 'true');
    }

    if (activeTags.includes('Preporučeno')) {
      query.append('recommended', 'true');
    }
    if (activeTags.includes('Akcija')) {
  query.append('on_sale', 'true');
    }
    if (activeTags.includes('Preporučeno')) {
      query.append('recommended', 'true');
    }

    // Dodaj sve izabrane kategorije
    const allCategories = ['Popularna psihologija', 'Roman', 'Klasici', 'Istorijski roman', 'Deca'];
    const selectedCategories = activeTags.filter(tag => allCategories.includes(tag));
    selectedCategories.forEach(cat => {
      query.append('category', cat);
    });

    if (priceRange[1] < 10000) {
      query.append('max_price', priceRange[1]);
    }

    const url = query.toString().length > 0
      ? `http://127.0.0.1:5000/api/books?${query.toString()}`
      : `http://127.0.0.1:5000/api/books`;

    console.log('Zahtev ka backendu:', url);

    axios
      .get(url)
      .then(res => {
        console.log('Odgovor sa servera:', res.data);
        setBooks(res.data);
      })
      .catch(err => {
        console.error('Greška pri zahtevu:', err);
        setBooks([]);
      });
  }, [activeTags, priceRange, searchTerm]);

  return (
    <div className="all-books-page">
      <Header />

      <div className="all-books-wrapper">
        <div className="all-books-window">
          <SideBar
            activeTags={activeTags}
            onToggle={toggleTag}
            priceRange={priceRange}
            priceRangeTemp={priceRangeTemp}
            onPriceChangeTemp={setPriceRangeTemp}
            onPriceConfirm={onPriceConfirm}
          />

          <div className="books-window">
            <div className="active-tags">
              {activeTags.map(tag => (
                <span key={tag} className="tag-pill">
                  {tag}
                  <button onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>

            {(activeTags.length > 0 || priceRange[1] < 10000 || searchTerm) && (
              <button className="reset-btn" onClick={resetFilters}>
                Resetuj filtere
              </button>
            )}

            {books.length === 0 ? (
              <p style={{ color: '#204d91' }}>Nema knjiga koje odgovaraju filterima.</p>
            ) : (
              <div className="book-grid">
                {books.map((book, index) => (
                  <BookCard key={book.id || book._id || index} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AllBooks;