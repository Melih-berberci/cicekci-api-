import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { authAPI } from './api';
import PublicCatalog from './pages/PublicCatalog';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = authAPI.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function handleLogin(userData) {
    setUser(userData);
  }

  async function handleLogout() {
    authAPI.logout();
    setUser(null);
  }

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicCatalog />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={user ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/admin/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
