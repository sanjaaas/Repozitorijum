import React from 'react';
import './SideBar.css';

export default function SideBar({
  activeTags,
  onToggle,
  priceRange,
  priceRangeTemp,
  onPriceChangeTemp,
  onPriceConfirm
}) {
  const categories = [
    'Popularna psihologija',
    'Roman',
    'Klasici',
    'Istorijski roman',
    'Deca'
  ];
  const specialTags = ['Akcija', 'Preporučeno'];

  const renderTag = (tag) => (
    <button
      key={tag}
      className={`tag-btn ${activeTags.includes(tag) ? 'active' : ''}`}
      onClick={() => onToggle(tag)}
    >
      {tag}
    </button>
  );

  return (
    <div className="sidebar">
      <h4>Kategorije</h4>
      <div className="tag-group">
        {categories.map(renderTag)}
      </div>

      <h4>Filteri</h4>
      <div className="tag-group">
        {specialTags.map(renderTag)}
      </div>

   <h4>Cena</h4>
    <div className="price-slider">
    <input
        type="range"
        min="0"
        max="10000"
        step="100"
        value={priceRangeTemp}
        onChange={(e) => onPriceChangeTemp(+e.target.value)}
        style={{background: `linear-gradient(to right, #0077cc ${priceRangeTemp / 100}% ,
         #ffffff ${priceRangeTemp / 100}%)`
        }}

    />
    <div className="price-labels">
        do {priceRangeTemp} RSD
    </div>
    <button className="confirm-btn" onClick={onPriceConfirm}>
        Potvrdi
    </button>
    </div>
        </div>
  );
}