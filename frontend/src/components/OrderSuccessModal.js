import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccessModal.css";

const OrderSuccessModal = ({ show }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, navigate]);

  if (!show) return null;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">
        <h2>✅ Hvala na porudžbini!</h2>
        <p>Bićete uskoro preusmereni...</p>
      </div>
    </div>
  );
};

export default OrderSuccessModal;