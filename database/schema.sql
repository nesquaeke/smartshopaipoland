-- GroceryCompare Poland Database Schema
-- This file contains all table definitions for the grocery price comparison platform

-- Create database if not exists (run this manually)
-- CREATE DATABASE grocery_compare_poland;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location-based queries (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ==============================
-- PRODUCT CATEGORIES TABLE
-- ==============================
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_pl VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    parent_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================
-- STORES TABLE
-- ==============================
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('discount', 'convenience', 'hypermarket', 'supermarket')),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    categories TEXT[], -- Array of category names
    location_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================
-- STORE LOCATIONS TABLE
-- ==============================
CREATE TABLE store_locations (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    opening_hours JSONB, -- Store opening hours in JSON format
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for location-based queries
CREATE INDEX idx_store_locations_coords ON store_locations (latitude, longitude);

-- ==============================
-- PRODUCTS TABLE
-- ==============================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    category_id INTEGER NOT NULL REFERENCES product_categories(id),
    barcode VARCHAR(50),
    unit_type VARCHAR(20) NOT NULL CHECK (unit_type IN ('piece', 'kg', 'liter', 'package')),
    unit_size DECIMAL(10, 3), -- Size of the unit (e.g., 0.5 for 500ml)
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast product search
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('polish', name));
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_barcode ON products(barcode);

-- ==============================
-- PRICES TABLE
-- ==============================
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    store_location_id INTEGER REFERENCES store_locations(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PLN',
    unit_price DECIMAL(10, 2), -- Price per kg/liter for comparison
    discount_price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    is_promotion BOOLEAN DEFAULT FALSE,
    promotion_start TIMESTAMP WITH TIME ZONE,
    promotion_end TIMESTAMP WITH TIME ZONE,
    in_stock BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for price queries
CREATE INDEX idx_prices_product_store ON prices(product_id, store_id);
CREATE INDEX idx_prices_store_location ON prices(store_location_id);
CREATE INDEX idx_prices_promotion ON prices(is_promotion, promotion_end);
CREATE INDEX idx_prices_scraped_at ON prices(scraped_at);

-- ==============================
-- USERS TABLE
-- ==============================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    preferences JSONB DEFAULT '{}', -- Shopping preferences in JSON
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create index for user location queries
CREATE INDEX idx_users_coords ON users (latitude, longitude);
CREATE INDEX idx_users_email ON users(email);

-- ==============================
-- SHOPPING BASKETS TABLE
-- ==============================
CREATE TABLE shopping_baskets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200),
    total_estimated_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================
-- BASKET ITEMS TABLE
-- ==============================
CREATE TABLE basket_items (
    id SERIAL PRIMARY KEY,
    basket_id INTEGER NOT NULL REFERENCES shopping_baskets(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate items in same basket
CREATE UNIQUE INDEX idx_basket_items_unique ON basket_items(basket_id, product_id);

-- ==============================
-- SHOPPING PLANS TABLE
-- ==============================
CREATE TABLE shopping_plans (
    id SERIAL PRIMARY KEY,
    basket_id INTEGER NOT NULL REFERENCES shopping_baskets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('cheapest', 'fastest', 'balanced')),
    total_price DECIMAL(10, 2) NOT NULL,
    total_distance DECIMAL(10, 2), -- in kilometers
    estimated_time INTEGER, -- in minutes
    stores_to_visit JSONB, -- Array of stores with items to buy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================
-- AI RECOMMENDATIONS TABLE
-- ==============================
CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('product', 'store', 'promotion', 'route')),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    data JSONB, -- Recommendation details in JSON
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active recommendations
CREATE INDEX idx_ai_recommendations_active ON ai_recommendations(is_active, expires_at);
CREATE INDEX idx_ai_recommendations_user ON ai_recommendations(user_id, type);

-- ==============================
-- SCRAPING LOGS TABLE
-- ==============================
CREATE TABLE scraping_logs (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    products_scraped INTEGER DEFAULT 0,
    prices_updated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    error_details TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- ==============================
-- USER SEARCH HISTORY TABLE
-- ==============================
CREATE TABLE user_search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    search_query VARCHAR(500) NOT NULL,
    search_filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for search analytics
CREATE INDEX idx_search_history_user ON user_search_history(user_id);
CREATE INDEX idx_search_history_query ON user_search_history USING gin(to_tsvector('polish', search_query));

-- ==============================
-- PROMOTIONS TABLE
-- ==============================
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed', 'buy_x_get_y')),
    discount_value DECIMAL(10, 2),
    min_quantity INTEGER,
    applicable_products INTEGER[], -- Array of product IDs
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active promotions
CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date);

-- ==============================
-- INITIAL DATA INSERTS
-- ==============================

-- Insert product categories
INSERT INTO product_categories (name, name_pl, icon) VALUES
('bread', 'Pieczywo', '🍞'),
('dairy', 'Nabiał', '🥛'),
('meat', 'Mięso i ryby', '🥩'),
('vegetables', 'Warzywa', '🥕'),
('fruits', 'Owoce', '🍎'),
('drinks', 'Napoje', '🥤'),
('sweets', 'Słodycze', '🍭'),
('snacks', 'Przekąski', '🍿'),
('frozen', 'Mrożonki', '🧊'),
('spices', 'Przyprawy', '🧂'),
('household', 'Chemia gospodarcza', '🧽'),
('hygiene', 'Higiena osobista', '🧴'),
('baby', 'Artykuły dla dzieci', '🍼');

-- Insert stores
INSERT INTO stores (name, type, website, categories, location_count) VALUES
('Biedronka', 'discount', 'https://www.biedronka.pl', ARRAY['fruits', 'bread', 'dairy'], 3000),
('Żabka', 'convenience', 'https://www.zabka.pl', ARRAY['snacks', 'drinks', 'essentials'], 8000),
('LIDL', 'discount', 'https://www.lidl.pl', ARRAY['organic', 'bread', 'meat', 'dairy'], 800),
('Auchan', 'hypermarket', 'https://www.auchan.pl', ARRAY['electronics', 'clothing', 'home', 'food'], 90),
('Carrefour', 'hypermarket', 'https://www.carrefour.pl', ARRAY['food', 'electronics', 'clothing'], 90),
('Netto', 'discount', 'https://www.netto.pl', ARRAY['fruits', 'vegetables'], 400);

-- ==============================
-- FUNCTIONS AND TRIGGERS
-- ==============================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_locations_updated_at BEFORE UPDATE ON store_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_baskets_updated_at BEFORE UPDATE ON shopping_baskets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_basket_items_updated_at BEFORE UPDATE ON basket_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_plans_updated_at BEFORE UPDATE ON shopping_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate distance between two coordinates (simplified)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    distance DECIMAL;
BEGIN
    -- Simplified distance calculation using Haversine formula
    -- For production, consider using PostGIS ST_Distance function
    distance := 6371 * acos(
        cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
        sin(radians(lat1)) * sin(radians(lat2))
    );
    RETURN distance;
END;
$$ LANGUAGE plpgsql;

-- Create views for common queries

-- View for products with their cheapest prices
CREATE VIEW products_with_cheapest_prices AS
SELECT 
    p.id,
    p.name,
    p.brand,
    pc.name_pl as category_name,
    pc.icon as category_icon,
    MIN(pr.price) as cheapest_price,
    s.name as cheapest_store,
    p.image_url,
    p.unit_type
FROM products p
JOIN product_categories pc ON p.category_id = pc.id
JOIN prices pr ON p.id = pr.product_id
JOIN stores s ON pr.store_id = s.id
WHERE pr.in_stock = true
GROUP BY p.id, p.name, p.brand, pc.name_pl, pc.icon, s.name, p.image_url, p.unit_type;

-- View for current promotions
CREATE VIEW active_promotions AS
SELECT 
    p.*,
    s.name as store_name,
    s.logo_url as store_logo
FROM promotions p
JOIN stores s ON p.store_id = s.id
WHERE p.is_active = true
  AND (p.start_date IS NULL OR p.start_date <= NOW())
  AND (p.end_date IS NULL OR p.end_date >= NOW());

-- ==============================
-- INDEXES FOR PERFORMANCE
-- ==============================

-- Additional indexes for complex queries
CREATE INDEX idx_prices_product_price ON prices(product_id, price);
CREATE INDEX idx_prices_store_price ON prices(store_id, price);
CREATE INDEX idx_basket_items_basket ON basket_items(basket_id);
CREATE INDEX idx_shopping_plans_basket ON shopping_plans(basket_id);

-- Partial indexes for better performance
CREATE INDEX idx_prices_in_stock ON prices(product_id, store_id) WHERE in_stock = true;
CREATE INDEX idx_prices_promotions ON prices(product_id, store_id) WHERE is_promotion = true;

-- ==============================
-- COMPLETION MESSAGE
-- ==============================
SELECT 'GroceryCompare Poland database schema created successfully!' as status; 