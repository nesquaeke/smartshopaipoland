import express, { Request, Response } from 'express';

const router = express.Router();

// Sample Polish products data
const sampleProducts = [
  {
    id: 1,
    name: 'Banany',
    description: 'Świeże banany z Ekwadoru',
    brand: 'Dole',
    category_id: 5,
    category_name: 'Owoce',
    category_icon: '🍎',
    unit_type: 'kg',
    unit_size: 1,
    image_url: 'https://example.com/banana.jpg',
    prices: [
      { store_name: 'Biedronka', price: 4.99, is_promotion: false },
      { store_name: 'LIDL', price: 4.49, is_promotion: true, discount_percentage: 10 },
      { store_name: 'Auchan', price: 5.29, is_promotion: false }
    ]
  },
  {
    id: 2,
    name: 'Mleko 3,2%',
    description: 'Mleko pełnotłuste 1L',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    unit_type: 'liter',
    unit_size: 1,
    image_url: 'https://example.com/milk.jpg',
    prices: [
      { store_name: 'Biedronka', price: 3.49, is_promotion: false },
      { store_name: 'Żabka', price: 3.99, is_promotion: false },
      { store_name: 'LIDL', price: 3.29, is_promotion: false }
    ]
  },
  {
    id: 3,
    name: 'Chleb żytni',
    description: 'Chleb żytni tradycyjny 500g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    unit_type: 'piece',
    unit_size: 0.5,
    image_url: 'https://example.com/bread.jpg',
    prices: [
      { store_name: 'Biedronka', price: 2.99, is_promotion: false },
      { store_name: 'LIDL', price: 2.79, is_promotion: false },
      { store_name: 'Carrefour', price: 3.19, is_promotion: false }
    ]
  },
  {
    id: 4,
    name: 'Jabłka Gala',
    description: 'Jabłka Gala klasa I',
    brand: 'Lokalny Producent',
    category_id: 5,
    category_name: 'Owoce',
    category_icon: '🍎',
    unit_type: 'kg',
    unit_size: 1,
    image_url: 'https://example.com/apple.jpg',
    prices: [
      { store_name: 'Biedronka', price: 6.99, is_promotion: false },
      { store_name: 'LIDL', price: 5.99, is_promotion: true, discount_percentage: 15 },
      { store_name: 'Netto', price: 6.49, is_promotion: false }
    ]
  },
  {
    id: 5,
    name: 'Kurczak cały',
    description: 'Kurczak świeży całe 1kg',
    brand: 'Drob-Pol',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    unit_type: 'kg',
    unit_size: 1,
    image_url: 'https://example.com/chicken.jpg',
    prices: [
      { store_name: 'Biedronka', price: 8.99, is_promotion: false },
      { store_name: 'LIDL', price: 7.99, is_promotion: true, discount_percentage: 20 },
      { store_name: 'Auchan', price: 9.49, is_promotion: false }
    ]
  }
];

// GET /api/products - Get all products with pagination and filters
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

  let filteredProducts = [...sampleProducts];

  // Filter by search term
  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by category
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => product.category_id === categoryId);
  }

  const total = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  res.status(200).json({
    success: true,
    message: 'Produkty pobrane pomyślnie',
    data: paginatedProducts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  
  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      error: 'Nieprawidłowy ID produktu'
    });
  }

  const product = sampleProducts.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Produkt pobrany pomyślnie',
    data: product
  });
});

// GET /api/products/:id/prices - Get product prices across stores
router.get('/:id/prices', (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  
  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      error: 'Nieprawidłowy ID produktu'
    });
  }

  const product = sampleProducts.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  const prices = product.prices.map(price => ({
    ...price,
    store_id: Math.floor(Math.random() * 6) + 1, // Random store ID for demo
    in_stock: true
  }));

  const allPrices = prices.map(p => p.price);
  const cheapestPrice = Math.min(...allPrices);
  const mostExpensivePrice = Math.max(...allPrices);
  const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
  const bestDealStore = prices.find(p => p.price === cheapestPrice)?.store_name || '';

  const comparison = {
    product_id: product.id,
    product_name: product.name,
    product_image: product.image_url,
    category: product.category_name,
    prices,
    cheapest_price: cheapestPrice,
    most_expensive_price: mostExpensivePrice,
    average_price: Math.round(averagePrice * 100) / 100,
    price_difference: mostExpensivePrice - cheapestPrice,
    best_deal_store: bestDealStore
  };

  res.status(200).json({
    success: true,
    message: 'Porównanie cen produktu pobrane pomyślnie',
    data: comparison
  });
});

// POST /api/products/search - Search products
router.post('/search', (req: Request, res: Response) => {
  const { query, categoryId, page = 1, limit = 20 } = req.body;

  let filteredProducts = [...sampleProducts];

  if (query) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => product.category_id === categoryId);
  }

  const total = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  res.status(200).json({
    success: true,
    message: 'Wyszukiwanie produktów zakończone pomyślnie',
    data: paginatedProducts,
    meta: {
      query,
      categoryId,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// GET /api/products/categories - Get product categories
router.get('/categories', (req: Request, res: Response) => {
  const categories = [
    { id: 1, name: 'bread', name_pl: 'Pieczywo', icon: '🍞' },
    { id: 2, name: 'dairy', name_pl: 'Nabiał', icon: '🥛' },
    { id: 3, name: 'meat', name_pl: 'Mięso i ryby', icon: '🥩' },
    { id: 4, name: 'vegetables', name_pl: 'Warzywa', icon: '🥕' },
    { id: 5, name: 'fruits', name_pl: 'Owoce', icon: '🍎' },
    { id: 6, name: 'drinks', name_pl: 'Napoje', icon: '🥤' },
    { id: 7, name: 'sweets', name_pl: 'Słodycze', icon: '🍭' },
    { id: 8, name: 'snacks', name_pl: 'Przekąski', icon: '🍿' },
    { id: 9, name: 'frozen', name_pl: 'Mrożonki', icon: '🧊' },
    { id: 10, name: 'spices', name_pl: 'Przyprawy', icon: '🧂' },
    { id: 11, name: 'household', name_pl: 'Chemia gospodarcza', icon: '🧽' },
    { id: 12, name: 'hygiene', name_pl: 'Higiena osobista', icon: '🧴' },
    { id: 13, name: 'baby', name_pl: 'Artykuły dla dzieci', icon: '🍼' }
  ];

  res.status(200).json({
    success: true,
    message: 'Kategorie produktów pobrane pomyślnie',
    data: categories,
    meta: {
      total: categories.length
    }
  });
});

export default router; 