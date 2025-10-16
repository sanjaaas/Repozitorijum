import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderModal from "../components/OrderModal";
import OrderSuccessModal from "../components/OrderSuccessModal";
import AddToCartModal from "../components/AddToCartModal"; // Dodaj ako koristiš modal za dodavanje
import "./Cart.css";

function Cart() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data);
      }
    } catch (err) {
      console.error("Greška pri učitavanju korpe:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleDecrease = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "decrease" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(updated);
      }
    } catch (err) {
      console.error("Greška pri smanjenju količine:", err);
    }
  };

  const handleRemoveAll = async () => {
    try {
      const res = await fetch("/api/cart/all", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setItems([]);
      }
    } catch (err) {
      console.error("Greška pri brisanju svih stavki:", err);
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderData.name || !orderData.address || !orderData.phone) {
      alert("Molimo popunite sva polja.");
      return;
    }

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        setItems([]);
        setShowModal(false);
        setShowSuccessModal(true);
      } else {
        alert(data.error || "Greška pri porudžbini.");
      }
    } catch (err) {
      console.error("Greška pri potvrdi porudžbine:", err);
    }
  };

  const handleAddToCart = async (bookId, quantity) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId, quantity }),
      });
      if (res.ok) {
        fetchCart(); 
      }
    } catch (err) {
      console.error("Greška pri dodavanju u korpu:", err);
    }
  };

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-wrapper">
        <div className="cart-window">
          <h2 style={{ color: "#204d91", marginBottom: "1rem" }}>Vaša korpa</h2>

          {items.length === 0 ? (
            <p style={{ color: "#333" }}>Korpa je prazna.</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.cart_id}
                  className="cart-item-row"
                  onClick={() => navigate(`/books/${item.book_id}`)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="item-image"
                  />

                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p>{item.author}</p>
                    <p>
                      Jedinična cena:{" "}
                      {Number(item.final_price || item.price).toFixed(2)} RSD
                    </p>
                    <p>Količina: {item.quantity}</p>
                    <p>
                      Ukupno:{" "}
                      {(
                        Number(item.final_price || item.price) *
                        Number(item.quantity)
                      ).toFixed(2)}{" "}
                      RSD
                    </p>
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrease(item.cart_id);
                      }}
                    >
                      Ukloni
                    </button>
                  </div>
                </div>
              ))}

              <div className="remove-all-wrapper">
                <button className="remove-all-btn" onClick={handleRemoveAll}>
                  Ukloni sve iz korpe
                </button>
              </div>

              <div className="purchase-wrapper">
                <button
                  className="purchase-btn"
                  onClick={() => setShowModal(true)}
                >
                  Kupi
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      {showModal && (
        <OrderModal
          orderData={orderData}
          setOrderData={setOrderData}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowModal(false)}
        />
      )}

      <OrderSuccessModal show={showSuccessModal} />
    </div>
  );
}

export default Cart;