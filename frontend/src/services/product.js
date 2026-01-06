import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/v1/products', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/v1/products/${id}`);
    return response.data;
  },
};
