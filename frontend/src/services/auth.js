import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/v1/auth/login', { email, password });
    if (response.data.tokens) {
      localStorage.setItem('token', response.data.tokens.access.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post('/v1/auth/register', { name, email, password });
    if (response.data.tokens) {
      localStorage.setItem('token', response.data.tokens.access.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
