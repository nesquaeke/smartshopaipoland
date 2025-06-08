// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3535',
  },
  production: {
    baseURL: 'https://smartshopai-backend.onrender.com',
  }
};

const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Use environment variable if available, otherwise use config
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || API_CONFIG[getEnvironment()].baseURL;

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

// Fetch helper with error handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiRequest
}; 