// Store Interface
export interface Store {
  id: number;
  name: string;
  type: 'discount' | 'convenience' | 'hypermarket' | 'supermarket';
  website: string;
  logo_url?: string;
  categories: string[];
  location_count: number;
  created_at: Date;
  updated_at: Date;
}

// Store Location Interface
export interface StoreLocation {
  id: number;
  store_id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  phone?: string;
  opening_hours: any; // JSON object
  created_at: Date;
  updated_at: Date;
}

// Product Category Interface
export interface ProductCategory {
  id: number;
  name: string;
  name_pl: string;
  icon: string;
  parent_id?: number;
  created_at: Date;
  updated_at: Date;
}

// Product Interface
export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category_id: number;
  barcode?: string;
  unit_type: 'piece' | 'kg' | 'liter' | 'package';
  unit_size?: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  category_name?: string;
  category_icon?: string;
}

// Price Interface
export interface Price {
  id: number;
  product_id: number;
  store_id: number;
  store_location_id?: number;
  price: number;
  currency: string;
  unit_price?: number; // price per kg/liter
  discount_price?: number;
  discount_percentage?: number;
  is_promotion: boolean;
  promotion_start?: Date;
  promotion_end?: Date;
  in_stock: boolean;
  scraped_at: Date;
  created_at: Date;
  updated_at: Date;
}

// User Interface
export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  preferences: any; // JSON object for shopping preferences
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

// Shopping Basket Interface
export interface ShoppingBasket {
  id: number;
  user_id?: number;
  name?: string;
  items: BasketItem[];
  total_estimated_price?: number;
  created_at: Date;
  updated_at: Date;
}

// Basket Item Interface
export interface BasketItem {
  id: number;
  basket_id: number;
  product_id: number;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Shopping Plan Interface
export interface ShoppingPlan {
  id: number;
  basket_id: number;
  user_id?: number;
  plan_type: 'cheapest' | 'fastest' | 'balanced';
  total_price: number;
  total_distance: number;
  estimated_time: number; // in minutes
  stores_to_visit: PlanStore[];
  created_at: Date;
  updated_at: Date;
}

// Plan Store Interface
export interface PlanStore {
  store_id: number;
  store_location_id: number;
  items: PlanItem[];
  subtotal: number;
  distance_from_user: number;
  visit_order: number;
}

// Plan Item Interface
export interface PlanItem {
  product_id: number;
  quantity: number;
  price: number;
  total_price: number;
}

// Price Comparison Interface
export interface PriceComparison {
  product_id: number;
  product_name: string;
  product_image?: string;
  category: string;
  prices: ProductPrice[];
  cheapest_price: number;
  most_expensive_price: number;
  average_price: number;
  price_difference: number;
  best_deal_store: string;
}

// Product Price for Comparison
export interface ProductPrice {
  store_id: number;
  store_name: string;
  store_logo?: string;
  price: number;
  discount_price?: number;
  discount_percentage?: number;
  is_promotion: boolean;
  in_stock: boolean;
  distance?: number;
  location_id?: number;
}

// AI Recommendation Interface
export interface AIRecommendation {
  id: number;
  user_id?: number;
  type: 'product' | 'store' | 'promotion' | 'route';
  title: string;
  description: string;
  data: any; // JSON object with recommendation details
  confidence_score: number;
  is_active: boolean;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Search Result Interface
export interface SearchResult {
  products: Product[];
  stores: Store[];
  total_products: number;
  total_stores: number;
  search_query: string;
  search_filters?: any;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any; // Allow additional properties
  };
}

// Pagination Interface
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search Filters Interface
export interface SearchFilters {
  category_id?: number;
  store_ids?: number[];
  min_price?: number;
  max_price?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  in_stock_only?: boolean;
  promotions_only?: boolean;
}

// Distance Calculation Interface
export interface DistanceCalculation {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number; // in kilometers
  duration: number; // in minutes
  mode: 'driving' | 'walking' | 'transit';
} 