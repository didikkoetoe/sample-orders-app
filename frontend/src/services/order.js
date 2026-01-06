import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/v1/orders', orderData);
    return response.data;
  },

  async getMyOrders(params = {}) {
    const response = await api.get('/v1/orders/my-orders', { params });
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/v1/orders/${id}`);
    return response.data;
  },

  async updateOrder(id, data) {
    const response = await api.patch(`/v1/orders/${id}`, data);
    return response.data;
  },
};
