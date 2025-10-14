import React, { useState } from 'react';
import axios from 'axios';
import './AddBookModal.css';

function AddBookModal({ onClose, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    publisher: '',
    price: '',
    sale_price: '',
    category: '',
    is_recommended: false,
    is_on_sale: false,
    image_url: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === 'is_on_sale' && !checked) {
      setFormData(prev => ({
        ...prev,
        is_on_sale: false,
        sale_price: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const form = new FormData();
    form.append('image', imageFile);

    setUploading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/upload', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, image_url: res.data.image_url }));
    } catch (err) {
      console.error('Greška pri uploadu slike:', err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price) {
      alert('Naslov, autor i cena su obavezni.');
      return;
    }

    if (imageFile && !formData.image_url) {
      await handleImageUpload();
      if (!formData.image_url) {
        alert('Upload slike nije uspeo.');
        return;
      }
    }

    const cleanData = {
      ...formData,
      sale_price: formData.is_on_sale ? formData.sale_price : null
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/books', cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBookAdded();
      onClose();
    } catch (err) {
      console.error('Greška pri dodavanju knjige:', err.response?.data || err.message);
      alert('Dodavanje nije uspelo.');
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    } else {
      alert('Molimo izaberite validnu sliku (.jpg, .png, ...).');
      setImageFile(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>Dodaj novu knjigu</h3>
        <form className="add-book-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Naslov" value={formData.title} onChange={handleChange} required />
          <input name="author" placeholder="Autor" value={formData.author} onChange={handleChange} required />
          <input name="publisher" placeholder="Izdavač" value={formData.publisher} onChange={handleChange} />
          <input name="category" placeholder="Kategorija" value={formData.category} onChange={handleChange} />
          <textarea name="description" placeholder="Opis" value={formData.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Cena" value={formData.price} onChange={handleChange} required />
          <input
            name="sale_price"
            type="number"
            placeholder="Akcijska cena"
            value={formData.sale_price}
            onChange={handleChange}
            disabled={!formData.is_on_sale}
          />

          <div className="checkbox-group">
            <input type="checkbox" name="is_on_sale" checked={formData.is_on_sale} onChange={handleChange} />
            <label htmlFor="is_on_sale">Na akciji</label>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" name="is_recommended" checked={formData.is_recommended} onChange={handleChange} />
            <label htmlFor="is_recommended">Preporučena</label>
          </div>

          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="image-preview"
            />
          )}
          {uploading && <p>⏳ Uploadujem sliku...</p>}

          <div className="modal-actions">
            <button type="submit">Dodaj</button>
            <button type="button" onClick={onClose}>Otkaži</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;