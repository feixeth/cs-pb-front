// authentification api part
import api from './api'

export const authApi = {
  async getCsrfCookie() {
    await api.get('/sanctum/csrf-cookie');
  },

  async login(credentials) {
    await this.getCsrfCookie();
    const response = await api.post('/login', credentials);
    return response.data;
  },

  async register(userData) {
    await this.getCsrfCookie();
    const response = await api.post('/register', userData);
    return response.data;
  },

  async logout() {
    await api.post('/logout');
  },

  async getUser() {
    const response = await api.get('/api/user');
    return response.data;
  }
}
