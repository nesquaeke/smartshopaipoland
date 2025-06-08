const express = require('express');
const cors = require('cors');
const compression = require('compression');
const winston = require('winston');

// Import our new modules
const { securityConfig, rateLimits, corsOptions } = require('./middleware/security');
const { healthCheck } = require('./config/database');
const aiService = require('./services/aiService');
const PolishDishesService = require('./services/polishDishesService');

const app = express();
const PORT = process.env.PORT || 3535;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

// Enhanced Middleware Stack
app.use(securityConfig); // Security headers
app.use(compression()); // Gzip compression
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    FRONTEND_URL,
    'https://your-frontend-app.onrender.com' // We'll update this later
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimits.general);
app.use('/api/auth/', rateLimits.auth);
app.use('/api/search/', rateLimits.search);
app.use('/api/cart/', rateLimits.cart);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Store type to category mapping - realistic product categories per store type
const STORE_CATEGORY_MAPPING = {
  'discount': {
    allowed_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    priority_categories: [1, 2, 3, 4, 5, 6, 7]
  },
  'hypermarket': {
    allowed_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    priority_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  'convenience': {
    allowed_categories: [1, 2, 6, 7, 8, 12],
    priority_categories: [1, 2, 6, 7, 8]
  },
  'drugstore': {
    allowed_categories: [6, 7, 11, 12, 13],
    priority_categories: [12, 13]
  },
  'pharmacy': {
    allowed_categories: [12, 13],
    priority_categories: [12, 13]
  },
  'furniture': {
    allowed_categories: [14],
    priority_categories: [14]
  },
  'home_improvement': {
    allowed_categories: [11, 14, 19],
    priority_categories: [11, 14]
  },
  'electronics': {
    allowed_categories: [15, 17],
    priority_categories: [15]
  },
  'clothing': {
    allowed_categories: [16, 18],
    priority_categories: [16]
  },
  'shoes': {
    allowed_categories: [16, 18],
    priority_categories: [16, 18]
  },
  'bookstore': {
    allowed_categories: [15, 17],
    priority_categories: [17]
  },
  'sports': {
    allowed_categories: [16, 18],
    priority_categories: [18]
  },
  'retail': {
    allowed_categories: [11, 12, 13, 16],
    priority_categories: [11, 12, 16]
  },
  'petrol': {
    allowed_categories: [1, 6, 7, 8, 19],
    priority_categories: [6, 19]
  }
};

// Import enhanced products data from simple-server.js
const fs = require('fs');
const simpleServerPath = './src/simple-server.js';
let enhancedProducts = [];
let polishStores = [];

// Extract data from simple-server.js
try {
  const simpleServerContent = fs.readFileSync(simpleServerPath, 'utf8');
  
  // Extract enhancedProducts array
  const productsMatch = simpleServerContent.match(/const enhancedProducts = \[([\s\S]*?)\];/);
  if (productsMatch) {
    eval(`enhancedProducts = [${productsMatch[1]}];`);
  }
  
  // Extract stores array (not polishStores!)
  const storesMatch = simpleServerContent.match(/const stores = \[([\s\S]*?)\];/);
  if (storesMatch) {
    eval(`polishStores = [${storesMatch[1]}];`);
  }
  
  console.log(`✅ Data loaded: ${enhancedProducts.length} products, ${polishStores.length} stores`);
} catch (error) {
  logger.error('Error reading data from simple-server.js:', error);
  // Fallback data
  enhancedProducts = [
    {
      id: 1,
      name: 'Chleb żytni',
      description: 'Chleb żytni tradycyjny 500g',
      brand: 'Putka',
      category_id: 1,
      category_name: 'Pieczywo',
      category_icon: '🍞',
      prices: [
        { store_name: 'Biedronka', price: 2.99 },
        { store_name: 'LIDL', price: 2.79 }
      ]
    }
  ];
  
  polishStores = [
    {
      id: 1,
      name: 'Biedronka',
      type: 'discount',
      location: 'Warszawa',
      logo: '🛒'
    }
  ];
}

// Initialize Polish Dishes Service
const polishDishesService = new PolishDishesService(enhancedProducts);

// Yemek malzemelerini ürün kataloğuna ekle
const enrichedProducts = polishDishesService.addIngredientsToProductCatalog();
enhancedProducts.push(...polishDishesService.generateCookingIngredients());

console.log(`✅ Cooking ingredients added: ${polishDishesService.generateCookingIngredients().length} new products`);
console.log(`📊 Total products now: ${enhancedProducts.length}`);

// Enhanced Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    
    res.json({
      status: 'OK',
      message: 'SmartShopAI Enhanced API is running',
      total_products: enhancedProducts.length,
      total_stores: polishStores.length,
      total_categories: [...new Set(enhancedProducts.map(p => p.category_id))].length,
      version: '2.1.0-enhanced',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      ai_service: aiService ? 'Available' : 'Unavailable'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Enhanced API Endpoints

// Products with AI enhancements
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, limit = 1000, store } = req.query;
    let filteredProducts = [...enhancedProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_id == category);
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (store) {
      filteredProducts = filteredProducts.filter(p => 
        p.prices.some(price => price.store_name.toLowerCase().includes(store.toLowerCase()))
      );
    }

    // Limit results
    filteredProducts = filteredProducts.slice(0, parseInt(limit));

    res.json({
      products: filteredProducts,
      total: filteredProducts.length,
      filters_applied: { category, search, store, limit }
    });
  } catch (error) {
    logger.error('Products API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI-powered product recommendations
app.get('/api/products/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart_items } = req.query;
    
    let cartItems = [];
    if (cart_items) {
      cartItems = JSON.parse(cart_items);
    }
    
    const userPreferences = {
      language: 'pl',
      budget: 500,
      dietary_restrictions: []
    };
    
    const recommendations = await aiService.getShoppingRecommendations(
      userId, 
      cartItems, 
      userPreferences
    );
    
    res.json({
      user_id: userId,
      recommendations,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// AI price prediction
app.get('/api/products/:id/price-prediction', async (req, res) => {
  try {
    const { id } = req.params;
    const product = enhancedProducts.find(p => p.id == id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Mock historical prices for demo
    const historicalPrices = {};
    product.prices.forEach(price => {
      historicalPrices[price.store_name] = [
        price.price,
        price.price * 0.95,
        price.price * 1.05,
        price.price * 0.98
      ];
    });
    
    const predictions = await aiService.predictPrices(id, historicalPrices);
    
    res.json({
      product_id: id,
      product_name: product.name,
      current_prices: product.prices,
      predictions,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Price prediction error:', error);
    res.status(500).json({ error: 'Failed to predict prices' });
  }
});

// AI meal planning
app.post('/api/ai/meal-plan', async (req, res) => {
  try {
    const { cart_items, family_size = 2, dietary_restrictions = [], budget = 200 } = req.body;
    
    const mealPlan = await aiService.generateMealPlan(
      cart_items || [],
      family_size,
      dietary_restrictions,
      budget
    );
    
    res.json({
      meal_plan: mealPlan,
      parameters: { family_size, dietary_restrictions, budget },
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Meal planning error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// 🍽️ POLISH DISHES - Enhanced Meal Planning with Cost Analysis

// Get all Polish dishes
app.get('/api/polish-dishes', (req, res) => {
  try {
    const dishes = polishDishesService.getAllDishes();
    res.json({
      dishes,
      total_dishes: dishes.length,
      categories: [...new Set(dishes.map(d => d.category))],
      message: 'Geleneksel Polonya yemekleri maliyet analizi ile birlikte!'
    });
  } catch (error) {
    logger.error('Polish dishes error:', error);
    res.status(500).json({ error: 'Failed to get Polish dishes' });
  }
});

// Get specific dish with cost analysis
app.get('/api/polish-dishes/:dishId', (req, res) => {
  try {
    const { dishId } = req.params;
    const dish = polishDishesService.getDishById(dishId);
    
    if (!dish) {
      return res.status(404).json({ error: 'Yemek bulunamadı' });
    }
    
    res.json({
      dish,
      instructions_available: true,
      ingredients_count: dish.ingredients.length
    });
  } catch (error) {
    logger.error('Polish dish detail error:', error);
    res.status(500).json({ error: 'Failed to get dish details' });
  }
});

// Calculate dish cost and show savings
app.get('/api/polish-dishes/:dishId/cost-analysis', (req, res) => {
  try {
    const { dishId } = req.params;
    const costAnalysis = polishDishesService.calculateDishCost(dishId);
    
    if (costAnalysis.error) {
      return res.status(404).json(costAnalysis);
    }
    
    res.json({
      ...costAnalysis,
      analysis_summary: {
        home_cooking_vs_restaurant: {
          home_cost: costAnalysis.cost_summary.total_cost,
          restaurant_cost: costAnalysis.cost_summary.restaurant_price,
          savings: costAnalysis.cost_summary.savings,
          savings_percentage: costAnalysis.cost_summary.savings_percentage,
          recommendation: costAnalysis.cost_summary.savings > 0 ? 
            `🏆 Evde yaparsanız ${costAnalysis.cost_summary.savings.toFixed(2)} PLN tasarruf edebilirsiniz!` :
            `🍽️ Restoranda yemek daha ekonomik olabilir.`
        },
        cheapest_shopping_strategy: Object.values(costAnalysis.cheapest_stores)
          .sort((a, b) => b.items.length - a.items.length)[0]?.store_name || 'Çeşitli mağazalar'
      },
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Cost analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze dish cost' });
  }
});

// Generate shopping list for a dish
app.post('/api/polish-dishes/:dishId/shopping-list', (req, res) => {
  try {
    const { dishId } = req.params;
    const { add_to_cart = false } = req.body;
    
    const shoppingList = polishDishesService.generateShoppingList(dishId);
    
    if (shoppingList.error) {
      return res.status(404).json(shoppingList);
    }
    
    res.json({
      ...shoppingList,
      ready_for_cart: true,
      add_to_cart_enabled: add_to_cart,
      shopping_tips: [
        `💡 En çok ürün ${shoppingList.store_recommendations[0]?.store_name || 'belirlenen mağaza'}da bulunuyor`,
        `💰 Toplam tahmini maliyet: ${shoppingList.total_estimated_cost.toFixed(2)} PLN`,
        `🛒 ${shoppingList.items_to_add.length} farklı malzeme gerekli`
      ],
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Shopping list error:', error);
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
});

// Get popular dishes ranked by savings
app.get('/api/polish-dishes/popular/by-savings', (req, res) => {
  try {
    const popularDishes = polishDishesService.getPopularDishes();
    
    res.json({
      popular_dishes: popularDishes,
      ranking_criteria: 'Tasarruf yüzdesine göre sıralanmış',
      best_savings: popularDishes[0] ? {
        dish: popularDishes[0].name,
        savings_percentage: popularDishes[0].savings_percentage,
        savings_amount: popularDishes[0].savings
      } : null,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Popular dishes error:', error);
    res.status(500).json({ error: 'Failed to get popular dishes' });
  }
});

// Compare multiple dishes
app.post('/api/polish-dishes/compare', (req, res) => {
  try {
    const { dish_ids } = req.body;
    
    if (!dish_ids || !Array.isArray(dish_ids)) {
      return res.status(400).json({ error: 'dish_ids array gerekli' });
    }
    
    const comparisons = dish_ids.map(dishId => {
      const costAnalysis = polishDishesService.calculateDishCost(dishId);
      return {
        dish_id: dishId,
        dish_name: costAnalysis.dish_info?.name,
        total_cost: costAnalysis.cost_summary?.total_cost || 0,
        restaurant_price: costAnalysis.cost_summary?.restaurant_price || 0,
        savings: costAnalysis.cost_summary?.savings || 0,
        savings_percentage: costAnalysis.cost_summary?.savings_percentage || 0,
        difficulty: polishDishesService.getDishById(dishId)?.difficulty,
        prep_time: polishDishesService.getDishById(dishId)?.prep_time
      };
    }).filter(item => item.dish_name);
    
    // En iyi seçenekleri bul
    const bestBySavings = comparisons.sort((a, b) => b.savings_percentage - a.savings_percentage)[0];
    const bestByPrice = comparisons.sort((a, b) => a.total_cost - b.total_cost)[0];
    
    res.json({
      dish_comparisons: comparisons,
      recommendations: {
        best_savings: bestBySavings,
        cheapest_to_make: bestByPrice,
        summary: `🏆 En çok tasarruf: ${bestBySavings?.dish_name} (%${bestBySavings?.savings_percentage})\n💰 En ucuz yapım: ${bestByPrice?.dish_name} (${bestByPrice?.total_cost.toFixed(2)} PLN)`
      },
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Dish comparison error:', error);
    res.status(500).json({ error: 'Failed to compare dishes' });
  }
});

// Stores endpoint
app.get('/api/stores', (req, res) => {
  try {
    const { type, city, limit = 1000 } = req.query;
    let filteredStores = [...polishStores];

    if (type) {
      filteredStores = filteredStores.filter(s => s.type === type);
    }
    
    if (city) {
      filteredStores = filteredStores.filter(s => 
        s.location.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    filteredStores = filteredStores.slice(0, parseInt(limit));

    res.json({
      stores: filteredStores,
      total: filteredStores.length,
      filters_applied: { type, city, limit }
    });
  } catch (error) {
    logger.error('Stores API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trending products with enhanced analytics
app.get('/api/products/trending', (req, res) => {
  try {
    // Get products with best savings
    const trendingProducts = enhancedProducts
      .map(product => {
        const prices = product.prices.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const savings = maxPrice - minPrice;
        const savingsPercentage = maxPrice > 0 ? ((savings / maxPrice) * 100) : 0;
        
        return {
          ...product,
          min_price: minPrice,
          max_price: maxPrice,
          potential_savings: savings,
          savings_percentage: Math.round(savingsPercentage)
        };
      })
      .filter(p => p.potential_savings > 0)
      .sort((a, b) => b.savings_percentage - a.savings_percentage)
      .slice(0, 20);

    res.json({
      trending_products: trendingProducts,
      analytics: {
        total_analyzed: enhancedProducts.length,
        avg_savings: trendingProducts.reduce((sum, p) => sum + p.potential_savings, 0) / trendingProducts.length,
        best_category: trendingProducts[0]?.category_name || 'N/A'
      }
    });
  } catch (error) {
    logger.error('Trending products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced search with AI
app.get('/api/search', async (req, res) => {
  try {
    const { q, category, max_price, min_savings, ai_suggestions = 'false' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const searchTerm = q.toLowerCase();
    let results = enhancedProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
    
    // Apply additional filters
    if (category) {
      results = results.filter(p => p.category_id == category);
    }
    
    if (max_price) {
      results = results.filter(p => 
        p.prices.some(price => price.price <= parseFloat(max_price))
      );
    }
    
    if (min_savings) {
      results = results.filter(p => {
        const prices = p.prices.map(price => price.price);
        const savings = Math.max(...prices) - Math.min(...prices);
        return savings >= parseFloat(min_savings);
      });
    }
    
    // AI suggestions
    let suggestions = [];
    if (ai_suggestions === 'true' && results.length > 0) {
      try {
        suggestions = await aiService.getShoppingRecommendations(
          'guest',
          results.slice(0, 3),
          { language: 'pl' }
        );
      } catch (error) {
        logger.warn('AI suggestions failed:', error);
      }
    }
    
    res.json({
      query: q,
      results: results.slice(0, 30),
      total_found: results.length,
      ai_suggestions: suggestions,
      search_time: Date.now()
    });
  } catch (error) {
    logger.error('Search API error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Categories with analytics
app.get('/api/categories', (req, res) => {
  try {
    const categories = enhancedProducts.reduce((acc, product) => {
      const existing = acc.find(cat => cat.id === product.category_id);
      if (existing) {
        existing.product_count++;
        existing.products.push({
          id: product.id,
          name: product.name,
          min_price: Math.min(...product.prices.map(p => p.price))
        });
      } else {
        acc.push({
          id: product.category_id,
          name: product.category_name,
          icon: product.category_icon,
          product_count: 1,
          products: [{
            id: product.id,
            name: product.name,
            min_price: Math.min(...product.prices.map(p => p.price))
          }]
        });
      }
      return acc;
    }, []);
    
    // Sort by product count
    categories.sort((a, b) => b.product_count - a.product_count);
    
    res.json({
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        product_count: cat.product_count,
        featured_products: cat.products.slice(0, 3)
      })),
      total_categories: categories.length
    });
  } catch (error) {
    logger.error('Categories API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'GET /api/products',
      'GET /api/stores', 
      'GET /api/products/trending',
      'GET /api/search',
      'GET /api/categories',
      'GET /api/products/recommendations/:userId',
      'GET /api/products/:id/price-prediction',
      'POST /api/ai/meal-plan',
      '🍽️ POLISH DISHES ENDPOINTS:',
      'GET /api/polish-dishes',
      'GET /api/polish-dishes/:dishId',
      'GET /api/polish-dishes/:dishId/cost-analysis',
      'POST /api/polish-dishes/:dishId/shopping-list',
      'GET /api/polish-dishes/popular/by-savings',
      'POST /api/polish-dishes/compare'
    ]
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Enhanced SmartShopAI server created successfully!`);
  console.log(`╔══════════════════════════════════════════════╗`);
  console.log(`║    🚀 SmartShopAI Enhanced API v2.1.0        ║`);
  console.log(`║              WITH AI & SECURITY              ║`);
  console.log(`║                                              ║`);
  console.log(`║  🚀 Server: http://localhost:${PORT}           ║`);
  console.log(`║  ❤️  Health: http://localhost:${PORT}/health     ║`);
  console.log(`║                                              ║`);
  console.log(`║  📊 ${enhancedProducts.length} Products | ${polishStores.length} Stores                    ║`);
  console.log(`║  🤖 AI-Powered Recommendations              ║`);
  console.log(`║  🔒 Enhanced Security Features              ║`);
  console.log(`║  💰 Real Polish prices & AI predictions    ║`);
  console.log(`║  🌍 Environment: ${NODE_ENV.toUpperCase()}                     ║`);
  console.log(`╚══════════════════════════════════════════════╝`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app; 