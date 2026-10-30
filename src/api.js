const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API helper
const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (email, password) => {
    return api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  login: async (email, password) => {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return api('/api/auth/me');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return api('/api/products');
  },

  getAllAdmin: async () => {
    return api('/api/products/admin');
  },

  getById: async (id) => {
    return api(`/api/products/${id}`);
  },

  create: async (product) => {
    return api('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },

  update: async (id, product) => {
    return api(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },

  delete: async (id) => {
    return api(`/api/products/${id}`, {
      method: 'DELETE'
    });
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return api('/api/categories');
  },

  getById: async (id) => {
    return api(`/api/categories/${id}`);
  },

  create: async (category) => {
    return api('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },

  update: async (id, category) => {
    return api(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  },

  delete: async (id) => {
    return api(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  }
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload Error');
    }

    return data;
  },

  deleteImage: async (publicId) => {
    return api(`/api/upload/${publicId}`, {
      method: 'DELETE'
    });
  }
};
