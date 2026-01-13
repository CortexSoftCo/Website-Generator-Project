import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Templates
export const getTemplates = (params) => api.get('/templates', { params });
export const getTemplate = (id) => api.get(`/templates/${id}`);
export const createTemplate = (data) => api.post('/templates', data);
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data);
export const deleteSellerTemplate = (id) => api.delete(`/templates/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Seller
export const getSellerProfile = () => api.get('/seller/profile');
export const updateSellerProfile = (data) => api.put('/seller/profile', data);
export const getSellerTemplates = () => api.get('/seller/templates');
export const getSellerStats = () => api.get('/seller/stats');

// Purchases
export const createPurchase = (data) => api.post('/purchases', data);
export const getUserPurchases = () => api.get('/purchases');
export const checkPurchase = (id) => api.get(`/purchases/check/${id}`);

// Reviews
export const createReview = (data) => api.post('/reviews', data);
export const getTemplateReviews = (id) => api.get(`/reviews/template/${id}`);

// Admin
export const getPendingTemplates = () => api.get('/admin/templates/pending');
export const approveTemplate = (id) => api.post(`/admin/templates/${id}/approve`);
export const rejectTemplate = (id) => api.post(`/admin/templates/${id}/reject`);
export const deleteAdminTemplate = (id) => api.delete(`/admin/templates/${id}/delete`);
export const getAllUsers = () => api.get('/admin/users');
export const verifyUser = (id) => api.post(`/admin/users/${id}/verify`);
export const getAdminStats = () => api.get('/admin/stats');

// AI Generator
export const generateWebsite = (data) => api.post('/ai/generate', data);
export const improvePrompt = (data) => api.post('/ai/improve-prompt', data);
export const getUserAIWebsites = () => api.get('/ai/websites');
export const getAIWebsite = (id) => api.get(`/ai/websites/${id}`);
export const regenerateAIWebsite = (id, data) => api.post(`/ai/regenerate/${id}`, data);

// Template Customization
export const customizeTemplate = (templateId, formData) => {
  return api.post(`/templates/${templateId}/customize`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteAIWebsite = (id) => api.delete(`/ai/websites/${id}`);
export const downloadAIWebsite = (id) => api.get(`/ai/websites/${id}/download`);
export const getAISuggestions = (data) => api.post('/ai/suggestions', data);

// Upload
export const uploadTemplate = (formData) => api.post('/upload/template', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const uploadImages = (formData) => api.post('/upload/images', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Payment
export const initiateJazzCashPayment = (data) => api.post('/payment/jazzcash/initiate', data);
export const checkPaymentStatus = (paymentId) => api.get(`/payment/${paymentId}/status`);
export const getUserPaymentHistory = () => api.get('/payment/user/history');

export default api;