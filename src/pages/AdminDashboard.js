import React, { useEffect, useState } from 'react';
import { productsAPI, categoriesAPI, uploadAPI } from '../api';
import ProductForm from '../components/ProductForm';
import AdminCategories from './AdminCategories';

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState('products');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.getAllAdmin();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return;
    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      setError('Silme hatası: ' + err.message);
    }
  }

  async function handleLogout() {
    onLogout && onLogout();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Paneli</h1>
      <button onClick={handleLogout}>Çıkış</button>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setView('products')}>Ürünler</button>
        <button onClick={() => setView('categories')}>Kategoriler</button>
      </div>

      {view === 'products' && (
        <>
          <h2>Ürünler</h2>
          <button onClick={() => setEditing({})}>Yeni Ürün</button>
          {loading ? (
            <div style={{ marginTop: 12 }}>Yükleniyor...</div>
          ) : (
            <div style={{ marginTop: 12 }}>
              {products.length === 0 ? (
                <div>Henüz ürün yok</div>
              ) : (
                products.map((p) => (
                  <div key={p._id} style={{ borderBottom: '1px solid #eee', padding: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                    <div>
                      <strong>{p.name}</strong> — {p.price} TL
                      <div style={{ fontSize: '0.9em', color: p.published ? 'green' : 'gray' }}>
                        ({p.published ? 'Yayında' : 'Taslak'})
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <button onClick={() => setEditing(p)}>Düzenle</button>
                      <button onClick={() => handleDelete(p._id)} style={{ marginLeft: 8 }}>Sil</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {view === 'categories' && <AdminCategories />}

      {editing && (
        <ProductForm
          product={editing}
          onDone={() => { setEditing(null); fetchProducts(); }}
          galleryUrl={selectedPhoto}
        />
      )}
    </div>
  );
}
