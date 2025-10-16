import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddToCartModal from "../components/AddToCartModal";
import Toast from "../components/Toast";
import "./Cart.css";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastLink, setToastLink] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setItems(data);
        }
      } catch (err) {
        console.error("Greška pri učitavanju liste želja:", err);
      }
    }

    fetchWishlist();
  }, [token]);

  const handleRemoveItem = async (wishlistId) => {
    try {
      const res = await fetch(`/api/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.wishlist_id !== wishlistId));
      }
    } catch (err) {
      console.error("Greška pri uklanjanju stavke:", err);
    }
  };

  const handleRemoveAll = async () => {
    try {
      for (const item of items) {
        await fetch(`/api/wishlist/${item.wishlist_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setItems([]);
      setToastMessage("Lista želja je uspešno obrisana.");
      setToastLink(null);
    } catch (err) {
      console.error("Greška pri uklanjanju svih stavki:", err);
    }
  };

  const handleAddToCart = (book) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  const handleConfirmAddToCart = async (bookId, quantity) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId, quantity }),
      });
      setToastMessage("Knjiga dodata u korpu!");
      setToastLink({ text: "Pogledaj korpu", href: "/cart" });
      setShowAddModal(false);
    } catch (err) {
      console.error("Greška pri dodavanju u korpu:", err);
    }
  };

  const handleAddAllToCart = async () => {
    try {
      for (const item of items) {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ book_id: item.book_id, quantity: 1 }),
        });
      }
      setToastMessage("Sve knjige su dodate u korpu!");
      setToastLink({ text: "Pogledaj korpu", href: "/cart" });
    } catch (err) {
      console.error("Greška pri dodavanju svih knjiga:", err);
    }
  };

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-wrapper">
        <div className="cart-window">
          <h2 style={{ color: "#204d91", marginBottom: "1rem" }}>Lista želja</h2>

          {items.length === 0 ? (
            <p style={{ color: "#333" }}>Lista želja je prazna.</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.wishlist_id}
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
                    <p>Cena: {item.price.toFixed(2)} RSD</p>
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.wishlist_id);
                      }}
                    >
                      Ukloni
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      Dodaj u korpu
                    </button>
                  </div>
                </div>
              ))}

              <div className="remove-all-wrapper">
                <button className="remove-all-btn" onClick={handleRemoveAll}>
                  Ukloni sve iz liste
                </button>
              </div>

              <div className="purchase-wrapper">
                <button className="purchase-btn" onClick={handleAddAllToCart}>
                  Dodaj sve u korpu
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      {showAddModal && selectedBook && (
        <AddToCartModal
          book={selectedBook}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleConfirmAddToCart}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          linkText={toastLink?.text}
          linkHref={toastLink?.href}
        />
      )}
    </div>
  );
}

export default Wishlist;