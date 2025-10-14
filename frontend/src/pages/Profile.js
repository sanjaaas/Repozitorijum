import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import OrderDetailsModal from '../components/OrderDetailsModal';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || token === 'null' || token === 'undefined') {
      setUser(null);
      return;
    }

    axios.get('http://127.0.0.1:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const safeUser = {
        ...res.data,
        orders: Array.isArray(res.data.orders) ? res.data.orders : [],
        stats: res.data.stats || {
          total_orders: 0,
          total_spent: 0,
          max_order: 0
        }
      };
      setUser(safeUser);
    })
    .catch(err => {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem('token');
      }
      setUser(null);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileUpdate = (updatedData) => {
    const token = localStorage.getItem('token');
    axios.put('http://127.0.0.1:5000/api/update-profile', updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setUser(prev => ({ ...prev, ...updatedData }));
    })
    .catch(err => {
      console.error("Greška pri ažuriranju profila:", err);
    });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Da li ste sigurni da želite da obrišete nalog?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/delete-account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.error || "Greška pri brisanju naloga.");
      }
    } catch (err) {
      console.error("Greška:", err);
      alert("Došlo je do greške.");
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  if (!user || !user.email) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-wrapper">
          <div className="profile-window">
            <p>Niste prijavljeni.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orders = user.orders;

  return (
    <>
      <div className="profile-page">
        <Header />

        <div className="profile-wrapper">
          <div className="profile-window">
            {/* Leva strana */}
            <div className="profile-left">
              <h2>Moj profil</h2>

              <section className="profile-section">
                <h3>👤 Podaci o korisniku</h3>
                <p><strong>Ime i prezime:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Uloga:</strong> {user.is_admin ? 'Admin' : 'Korisnik'}</p>
              </section>

              <section className="profile-section">
                <h3>📊 Statistika kupovine</h3>
                <p><strong>Ukupno porudžbina:</strong> {user.stats.total_orders}</p>
                <p><strong>Ukupno potrošeno:</strong> {user.stats.total_spent.toFixed(2)} RSD</p>
                <p><strong>Najskuplja porudžbina:</strong> {user.stats.max_order.toFixed(2)} RSD</p>
              </section>

              <section className="profile-section">
                <h3>⚙️ Podešavanje naloga</h3>
                <div className="profile-actions">
                  <button onClick={() => setShowChangeModal(true)}>Promeni lozinku</button>
                  <button onClick={() => setShowEditModal(true)}>Izmeni podatke</button>
                  <button className="delete-btn" onClick={handleDeleteAccount}>Obriši nalog</button>
                </div>
              </section>

              <div className="profile-actions">
                <button onClick={handleLogout}>Odjavi se</button>
              </div>
            </div>

            {/* Desna strana */}
            <div className="profile-right">
              <h3>🧾 Istorija porudžbina</h3>
              {orders.length > 0 ? (
                <div className="order-list">
                  {orders.map(order => (
                    <div key={order.order_id} className="order-card" onClick={() => openOrderModal(order)}>
                      <p><strong>Datum:</strong> {order.created_at}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Ukupno:</strong> {order.total_price.toFixed(2)} RSD</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nema porudžbina.</p>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal za izmenu korisničkih podataka */}
      {showEditModal && (
        <EditProfileModal
          isOpen={true}
          onRequestClose={() => setShowEditModal(false)}
          user={user}
          onSave={handleProfileUpdate}
        />
      )}

      {/* Modal za promenu lozinke */}
      {showChangeModal && (
        <ChangePasswordModal
          isOpen={true}
          onRequestClose={() => setShowChangeModal(false)}
        />
      )}

      {/* Modal za detalje porudžbine */}
      {showOrderModal && (
        <OrderDetailsModal
          isOpen={true}
          onRequestClose={closeOrderModal}
          order={selectedOrder}
        />
      )}
    </>
  );
}

export default Profile;