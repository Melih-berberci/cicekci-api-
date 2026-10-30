import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!name.trim()) {
      setError('Kategori adı zorunludur');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editing) {
        await categoriesAPI.update(editing._id, { name });
      } else {
        await categoriesAPI.create({ name });
      }
      setName('');
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    try {
      await categoriesAPI.delete(id);
      fetchCategories();
    } catch (err) {
      setError('Silme hatası: ' + err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Kategoriler</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div>
          {categories.map(c => (
            <div key={c._id} style={{ borderBottom: '1px solid #eee', padding: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{c.name}</strong>
                <span style={{ color: '#666', marginLeft: 10 }}>({c.slug})</span>
              </div>
              <div>
                <button onClick={() => { setEditing(c); setName(c.name); setError(null); }}>Düzenle</button>
                <button onClick={() => remove(c._id)} style={{ marginLeft: 10 }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Kategori adı"
          style={{ padding: 5, marginRight: 10 }}
        />
        <button onClick={save} disabled={loading}>
          {loading ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Ekle')}
        </button>
        {editing && (
          <button onClick={() => { setEditing(null); setName(''); setError(null); }} style={{ marginLeft: 10 }}>
            İptal
          </button>
        )}
      </div>
    </div>
  );
}
