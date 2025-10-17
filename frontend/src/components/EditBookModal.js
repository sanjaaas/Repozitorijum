import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditBookModal.css';

function EditBookModal({ book, onClose, onBookUpdated }) {
  const [formData, setFormData] = useState({ ...book });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setFormData({ ...book });
  }, [book]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'is_on_sale' && !checked) {
      setFormData(prev => ({ ...prev, is_on_sale: false, sale_price: '' }));
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
      const res = await axios.post('/api/upload', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, image_url: res.data.image_url }));
    } catch (err) {
      console.error('Greška pri uploadu slike:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

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
      await axios.put(`/api/books/${book.id}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBookUpdated();
      onClose();
    } catch (err) {
      console.error('Greška pri ažuriranju knjige:', err.response?.data || err.message);
      alert('Ažuriranje nije uspelo.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>Uredi knjigu</h3>
        <form className="edit-book-form" onSubmit={handleSubmit}>
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
            value={formData.sale_price || ''}
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

          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="image-preview" />
          ) : (
            formData.image_url && (
              <img src={formData.image_url} alt="Postojeća slika" className="image-preview" />
            )
          )}
          {uploading && <p>⏳ Uploadujem sliku...</p>}

          <div className="modal-actions">
            <button type="submit">Sačuvaj izmene</button>
            <button type="button" onClick={onClose}>Otkaži</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookModal;