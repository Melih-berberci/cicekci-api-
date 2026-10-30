import React, { useEffect, useState } from 'react';
import { productsAPI } from '../api';

export default function PublicCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products', err);
        setError('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Ürünler</h1>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {products.length === 0 ? (
            <div>Henüz yayınlanmış ürün yok</div>
          ) : (
            products.map((p) => (
              <div key={p._id} style={{ border: '1px solid #ddd', padding: 10, borderRadius: 8 }}>
                {p.image && (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4 }} />
                )}
                <h3 style={{ marginTop: 10 }}>{p.name}</h3>
                <p style={{ color: '#666' }}>{p.description}</p>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: 10 }}>{p.price} TL</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
