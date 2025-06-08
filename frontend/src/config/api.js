// API Configuration for different environments
const API_CONFIG = {
  development: {
    BACKEND_URL: 'http://localhost:3535',
    USE_STATIC_DATA: false
  },
  production: {
    BACKEND_URL: '/smartshopaipoland',
    USE_STATIC_DATA: true
  }
};

const env = process.env.NODE_ENV || 'development';
const config = API_CONFIG[env];

export const BACKEND_URL = config.BACKEND_URL;
export const USE_STATIC_DATA = config.USE_STATIC_DATA;

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
  return `${BACKEND_URL}${endpoint}`;
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

export default config; 