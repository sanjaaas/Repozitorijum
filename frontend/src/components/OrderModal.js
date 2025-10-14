import React from "react";
import "./OrderModal.css";

function OrderModal({ orderData, setOrderData, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Potvrda porudžbine</h3>
        <input
          type="text"
          placeholder="Ime i prezime"
          value={orderData.name}
          onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Adresa"
          value={orderData.address}
          onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Telefon"
          value={orderData.phone}
          onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
        />
        <div className="modal-actions">
          <button onClick={onConfirm}>Potvrdi</button>
          <button onClick={onCancel}>Otkaži</button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;