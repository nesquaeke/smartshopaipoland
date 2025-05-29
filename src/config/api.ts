// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3535';

// For production deployment, we'll use mock data if backend is not available
export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  stores: `${API_BASE_URL}/api/stores`,
  categories: `${API_BASE_URL}/api/products/categories`,
  trending: `${API_BASE_URL}/api/products/trending`,
  promotions: `${API_BASE_URL}/api/promotions`,
  cart: `${API_BASE_URL}/api/cart`,
  favorites: `${API_BASE_URL}/api/favorites`,
  health: `${API_BASE_URL}/health`
};

// Mock data for when backend is not available
export const MOCK_DATA = {
  enabled: process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_BASE_URL,
  
  products: [
    {
      id: 1,
      name: "Banan",
      description: "Słodkie banany z Ekwadoru",
      brand: "Chiquita",
      category_id: 1,
      category_name: "Owoce",
      category_icon: "🍌",
      prices: [
        { store_name: "Biedronka", price: 3.99, is_promotion: true, discount_percentage: 20 },
        { store_name: "LIDL", price: 4.49 },
        { store_name: "Żabka", price: 5.99 }
      ]
    },
    {
      id: 2,
      name: "Mleko 3.2%",
      description: "Świeże mleko krowie pasteryzowane",
      brand: "Łaciate",
      category_id: 2,
      category_name: "Nabiał",
      category_icon: "🥛",
      prices: [
        { store_name: "Biedronka", price: 2.89 },
        { store_name: "LIDL", price: 2.79 },
        { store_name: "Carrefour", price: 3.19 }
      ]
    },
    {
      id: 3,
      name: "Chleb Żytni",
      description: "Tradycyjny chleb żytni na zakwasie",
      brand: "Krupówki",
      category_id: 3,
      category_name: "Pieczywo",
      category_icon: "🍞",
      prices: [
        { store_name: "Biedronka", price: 4.29 },
        { store_name: "LIDL", price: 3.99, is_promotion: true, discount_percentage: 15 },
        { store_name: "Auchan", price: 4.89 }
      ]
    }
  ],
  
  stores: [
    { id: 1, name: 'Biedronka', type: 'discount', location_count: 3000, logo: '🐞', categories: ['fruits', 'bread', 'dairy'], website: 'https://www.biedronka.pl' },
    { id: 2, name: 'LIDL', type: 'discount', location_count: 800, logo: '🔵', categories: ['organic', 'bread', 'meat'], website: 'https://www.lidl.pl' },
    { id: 3, name: 'Żabka', type: 'convenience', location_count: 8000, logo: '🐸', categories: ['snacks', 'drinks'], website: 'https://www.zabka.pl' }
  ],
  
  categories: [
    { id: 1, name: "Fruits", name_pl: "Owoce", icon: "🍌", product_count: 25 },
    { id: 2, name: "Dairy", name_pl: "Nabiał", icon: "🥛", product_count: 18 },
    { id: 3, name: "Bread", name_pl: "Pieczywo", icon: "🍞", product_count: 12 }
  ]
};

// Helper function to fetch with fallback to mock data
export async function apiRequest(endpoint: string, options?: RequestInit) {
  if (MOCK_DATA.enabled) {
    // Return mock data based on endpoint
    const path = endpoint.split('/').pop();
    switch (path) {
      case 'products':
        return { ok: true, json: async () => ({ success: true, data: MOCK_DATA.products }) };
      case 'stores':
        return { ok: true, json: async () => ({ success: true, data: MOCK_DATA.stores }) };
      case 'categories':
        return { ok: true, json: async () => ({ success: true, data: MOCK_DATA.categories }) };
      case 'trending':
        return { ok: true, json: async () => ({ success: true, data: MOCK_DATA.products.slice(0, 3) }) };
      default:
        return { ok: true, json: async () => ({ success: true, data: [] }) };
    }
  }
  
  try {
    return await fetch(endpoint, options);
  } catch (error) {
    console.error('API request failed, using mock data:', error);
    return { ok: false, json: async () => ({ success: false, data: [] }) };
  }
} 