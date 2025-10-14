import React, { useState } from "react";
import "./AddToCartModal.css";

export default function AddToCartModal({ book, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    const validQuantity = Number(quantity);
    if (validQuantity < 1 || isNaN(validQuantity)) return;

    onConfirm(book.id, validQuantity); // šalje tačnu količinu
    onClose();
  };

  const handleOverlayClick = () => {
    setQuantity(1);
    onClose();
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    setQuantity(isNaN(val) || val < 1 ? 1 : val);
  };

  return (
    <div className="cart-modal-overlay" onClick={handleOverlayClick}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Dodaj u korpu</h3>
        <p className="book-title">{book.title}</p>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleConfirm}>
            Potvrdi
          </button>
        </div>
      </div>
    </div>
  );
}