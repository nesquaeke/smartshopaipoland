// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3535';

export const API_ENDPOINTS = {
  // Base URL
  BASE: API_BASE_URL,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCTS_TRENDING: `${API_BASE_URL}/api/products/trending`,
  PRODUCTS_CATEGORIES: `${API_BASE_URL}/api/products/categories`,
  
  // Stores
  STORES: `${API_BASE_URL}/api/stores`,
  STORES_WITH_PRODUCTS: `${API_BASE_URL}/api/stores/with-products`,
  
  // Promotions
  PROMOTIONS: `${API_BASE_URL}/api/promotions`,
  
  // Shopping List
  SHOPPING_LIST_GUEST: `${API_BASE_URL}/api/shopping-list/guest`,
  SHOPPING_LIST_ADD: `${API_BASE_URL}/api/shopping-list/add`,
  
  // AI & Optimization
  SHOPPING_ROUTE_OPTIMIZE: `${API_BASE_URL}/api/shopping-route/optimize`,
  AI_RECOMMENDATIONS: `${API_BASE_URL}/api/ai/recommendations`,
};

// Helper function to build API URLs with query parameters
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  if (!params) return endpoint;
  
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

export default API_ENDPOINTS; 