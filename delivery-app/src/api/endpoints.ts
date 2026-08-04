import apiClient from './client';

export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  signup: (userData: any) => 
    apiClient.post('/auth/signup', userData),
  forgotPassword: (email: string) => 
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) => 
    apiClient.post('/auth/reset-password', data),
  logout: () => 
    apiClient.post('/auth/logout'),
  verifyToken: () => 
    apiClient.get('/auth/verify'),
  getProfile: () => 
    apiClient.get('/auth/profile'),
  updateProfile: (data: any) => 
    apiClient.put('/auth/profile', data),
};

export const restaurantAPI = {
  getRestaurants: (params: any) => 
    apiClient.get('/restaurants', { params }),
  getRestaurantById: (id: string) => 
    apiClient.get(`/restaurants/${id}`),
  getRestaurantMenu: (id: string) => 
    apiClient.get(`/restaurants/${id}/menu`),
  getCategories: () => 
    apiClient.get('/restaurants/categories'),
  searchRestaurants: (query: string) => 
    apiClient.get('/restaurants/search', { params: { q: query } }),
  getFeaturedRestaurants: () => 
    apiClient.get('/restaurants/featured'),
  getOffers: () => 
    apiClient.get('/restaurants/offers'),
};

export const cartAPI = {
  getCart: () => 
    apiClient.get('/cart'),
  addToCart: (data: any) => 
    apiClient.post('/cart/add', data),
  updateCart: (data: any) => 
    apiClient.put('/cart/update', data),
  removeFromCart: (data: any) => 
    apiClient.post('/cart/remove', data),
  clearCart: () => 
    apiClient.delete('/cart/clear'),
  applyCoupon: (code: string) => 
    apiClient.post('/cart/apply-coupon', { code }),
};

export const orderAPI = {
  createOrder: (data: any) => 
    apiClient.post('/orders', data),
  getOrders: () => 
    apiClient.get('/orders'),
  getOrderById: (id: string) => 
    apiClient.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => 
    apiClient.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id: string) => 
    apiClient.post(`/orders/${id}/cancel`),
  getOrderHistory: () => 
    apiClient.get('/orders/history'),
  trackOrder: (id: string) => 
    apiClient.get(`/orders/${id}/track`),
};

export const paymentAPI = {
  createPaymentIntent: (data: any) => 
    apiClient.post('/payments/create-intent', data),
  confirmPayment: (data: any) => 
    apiClient.post('/payments/confirm', data),
  getPaymentMethods: () => 
    apiClient.get('/payments/methods'),
  addPaymentMethod: (data: any) => 
    apiClient.post('/payments/methods', data),
  removePaymentMethod: (id: string) => 
    apiClient.delete(`/payments/methods/${id}`),
};

export const addressAPI = {
  getAddresses: () => 
    apiClient.get('/addresses'),
  addAddress: (data: any) => 
    apiClient.post('/addresses', data),
  updateAddress: (id: string, data: any) => 
    apiClient.put(`/addresses/${id}`, data),
  deleteAddress: (id: string) => 
    apiClient.delete(`/addresses/${id}`),
  setDefaultAddress: (id: string) => 
    apiClient.patch(`/addresses/${id}/default`),
};