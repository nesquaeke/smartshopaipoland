// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3535',
  },
  production: {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://smartshopai-backend.onrender.com',
  }
};

const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

export const API_BASE_URL = API_CONFIG[getEnvironment()].baseURL;

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  PRODUCTS: '/api/products',
  STORES: '/api/stores', 
  CATEGORIES: '/api/categories',
  POLISH_DISHES: '/api/polish-dishes',
  PROMOTIONS: '/api/promotions',
  TRENDING: '/api/products/trending',
  PRODUCT_CATEGORIES: '/api/products/categories'
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl
}; 