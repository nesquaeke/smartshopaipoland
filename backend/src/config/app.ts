import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'grocery_compare_poland',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  
  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  // Scraping Configuration
  scraping: {
    delayMs: parseInt(process.env.SCRAPING_DELAY_MS || '2000'),
    concurrentLimit: parseInt(process.env.SCRAPING_CONCURRENT_LIMIT || '3'),
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  
  // Supported Stores
  stores: {
    biedronka: {
      name: 'Biedronka',
      type: 'discount',
      website: 'https://www.biedronka.pl',
      categories: ['fruits', 'bread', 'dairy'],
    },
    zabka: {
      name: 'Żabka',
      type: 'convenience',
      website: 'https://www.zabka.pl',
      categories: ['snacks', 'drinks', 'essentials'],
      locations: 8000,
    },
    lidl: {
      name: 'LIDL',
      type: 'discount',
      website: 'https://www.lidl.pl',
      categories: ['organic', 'bread', 'meat', 'dairy'],
      locations: 800,
    },
    auchan: {
      name: 'Auchan',
      type: 'hypermarket',
      website: 'https://www.auchan.pl',
      categories: ['electronics', 'clothing', 'home', 'food'],
      locations: 90,
    },
    carrefour: {
      name: 'Carrefour',
      type: 'hypermarket',
      website: 'https://www.carrefour.pl',
      categories: ['food', 'electronics', 'clothing'],
      locations: 90,
    },
    netto: {
      name: 'Netto',
      type: 'discount',
      website: 'https://www.netto.pl',
      categories: ['fruits', 'vegetables'],
      locations: 400,
    },
  },
  
  // Product Categories
  categories: [
    { id: 'bread', name: 'Pieczywo', icon: '🍞' },
    { id: 'dairy', name: 'Nabiał', icon: '🥛' },
    { id: 'meat', name: 'Mięso i ryby', icon: '🥩' },
    { id: 'vegetables', name: 'Warzywa', icon: '🥕' },
    { id: 'fruits', name: 'Owoce', icon: '🍎' },
    { id: 'drinks', name: 'Napoje', icon: '🥤' },
    { id: 'sweets', name: 'Słodycze', icon: '🍭' },
    { id: 'snacks', name: 'Przekąski', icon: '🍿' },
    { id: 'frozen', name: 'Mrożonki', icon: '🧊' },
    { id: 'spices', name: 'Przyprawy', icon: '🧂' },
    { id: 'household', name: 'Chemia gospodarcza', icon: '🧽' },
    { id: 'hygiene', name: 'Higiena osobista', icon: '🧴' },
    { id: 'baby', name: 'Artykuły dla dzieci', icon: '🍼' },
  ],
};

export default config; 