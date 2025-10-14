import React from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './OrderDetailsModal.css';

export default function OrderDetailsModal({ isOpen, onRequestClose, order }) {
  const navigate = useNavigate();

  const handleClick = (bookId) => {
    if (bookId) {
      navigate(`/books/${bookId}`);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="order-modal"
      overlayClassName="order-overlay"
      ariaHideApp={false}
    >
      <h2 className="order-title">Detalji porudžbine</h2>

      {order?.items?.length > 0 ? (
        <div className="order-items">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="order-item-row"
              onClick={() => handleClick(item.book_id)}
            >
              <img
                src={`http://127.0.0.1:5000${item.image_url}`}
                alt={item.title}
                className="order-item-image"
              />
              <div className="order-item-info">
                <h3>{item.title}</h3>
                <p>Količina: {item.quantity}</p>
                <p>Cena: {item.price.toFixed(2)} RSD</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="order-empty">Nema stavki u ovoj porudžbini.</p>
      )}

      <div className="order-buttons">
        <button onClick={onRequestClose}>Zatvori</button>
      </div>
    </ReactModal>
  );
}