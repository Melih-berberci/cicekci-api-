import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, uploadAPI } from '../api';

export default function ProductForm({ product = {}, onDone, galleryUrl }) {
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price || '');
  const [description, setDescription] = useState(product.description || '');
  const [published, setPublished] = useState(!!product.published);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(product.image || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (product._id) {
      fetchProductCategories();
    }
  }, [product._id]);

  async function fetchCategories() {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
      setError('Kategoriler yüklenemedi');
    }
  }

  async function fetchProductCategories() {
    if (product.categories) {
      setSelectedCategories(product.categories.map(c => c._id));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !price) {
      setError('İsim ve fiyat zorunludur');
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // Dosya yükleme
      if (file) {
        const data = await uploadAPI.uploadImage(file);
        finalImageUrl = data.url;
      }
      // URL ile resim ekleme (galeriden seçilen)
      else if (galleryUrl && !imageUrl) {
        finalImageUrl = galleryUrl;
      }

      const productData = {
        name,
        price: parseFloat(price),
        description,
        published,
        image: finalImageUrl,
        categories: selectedCategories
      };

      if (product._id) {
        await productsAPI.update(product._id, productData);
      } else {
        await productsAPI.create(productData);
      }

      onDone && onDone();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryToggle(categoryId) {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, border: '1px solid #ddd', padding: 12 }}>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="product-name">İsim</label>
        <input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 5 }}
          required
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="product-price">Fiyat</label>
        <input
          id="product-price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 5 }}
          required
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="product-description">Açıklama</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 5 }}
          rows={3}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Kategoriler</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 5 }}>
          {categories.map(cat => (
            <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleCategoryToggle(cat._id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="product-published">Yayınla</label>
        <input
          id="product-published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="product-image">Resim</label>
        {imageUrl && (
          <div style={{ marginTop: 5 }}>
            <img src={imageUrl} alt="Mevcut resim" style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              style={{ marginLeft: 10, padding: 5, background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Resmi Sil
            </button>
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: '0.9em', color: '#666' }}>Veya galeriden URL yapıştır:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            style={{ display: 'block', width: '100%', padding: 5, marginTop: 5 }}
          />
          {galleryUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(galleryUrl)}
              style={{ marginTop: 5, padding: 5, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Galeri Seçimini Yapıştır
            </button>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: '0.9em', color: '#666' }}>Veya dosya yükle:</label>
          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'block', marginTop: 5 }}
          />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
