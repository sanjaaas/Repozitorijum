import React, { useEffect, useState } from "react";
import "./OrderModal.css";

function OrderModal({ orderData, setOrderData, onConfirm, onCancel }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((items) => {
        const sum = items.reduce((acc, item) => {
          const price = Number(item.final_price || item.price);
          return acc + price * item.quantity;
        }, 0);
        setTotal(sum);
      })
      .catch((err) => {
        console.error("Greška pri sabiranju korpe:", err);
        setTotal(0);
      });
  }, []);

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

        <div className="total-price">
          <p>Ukupno za naplatu:</p>
          <h4>{total.toFixed(2)} RSD</h4>
        </div>

        <div className="modal-actions">
          <button onClick={onConfirm}>Potvrdi</button>
          <button onClick={onCancel}>Otkaži</button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;