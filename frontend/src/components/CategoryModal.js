import React from 'react';
import './CategoryModal.css';

const CategoryModal = ({ categories, onSelect, onClose }) => {
  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={e => e.stopPropagation()}>
        <h3>Izaberi kategoriju</h3>
        <ul>
          {categories.map(cat => (
            <li key={cat} onClick={() => onSelect(cat)}>
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryModal;