import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';

export default function Carousel() {
  const [knjige, setKnjige] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  axios
    .get('http://127.0.0.1:5000/api/books?recommended=true')
    .then(res => setKnjige(res.data))
    .catch(err => console.error('Greška:', err));
}, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '75px',
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true
  };

  return (
    <div className="carousel-wrapper">
      {knjige.length > 0 ? (
        <Slider {...settings}>
          {knjige.map(knjiga => (
            <div
              key={knjiga.id}
              className="carousel-card"
              onClick={() => navigate(`/books/${knjiga.id}`)} 
            >
              <img
                src={`http://127.0.0.1:5000${knjiga.image_url}`}
                alt={knjiga.title}
                className="carousel-image"
              />
              <div className="carousel-text">
                <h3>{knjiga.title}</h3>
                <p>{knjiga.author}</p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p style={{ textAlign: 'center', color: '#fff' }}>Učitavanje knjiga...</p>
      )}
    </div>
  );
}