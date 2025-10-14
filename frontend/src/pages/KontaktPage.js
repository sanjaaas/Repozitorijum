import React, { useState } from 'react';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    ime: '',
    email: '',
    poruka: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Povezati sa backendom (POST /api/contact)
    console.log('Slanje podataka:', formData);
  };

  return (
    <div className="kontakt-container">
      <h2>Kontaktiraj nas</h2>
      <p>📞 Telefon: +381 60 123 4567</p>

      <form className="kontakt-form" onSubmit={handleSubmit}>
        <label>
          Ime:
          <input
            type="text"
            name="ime"
            value={formData.ime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Poruka:
          <textarea
            name="poruka"
            rows="5"
            value={formData.poruka}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Pošalji</button>
      </form>
    </div>
  );
}