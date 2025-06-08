const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Rate Limiting Configuration
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const rateLimits = {
  // General API calls
  general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP'),
  
  // Auth endpoints (more strict)
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  
  // Search endpoints
  search: createRateLimit(1 * 60 * 1000, 20, 'Too many search requests'),
  
  // Cart operations
  cart: createRateLimit(1 * 60 * 1000, 30, 'Too many cart operations')
};

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Invalid token.' 
    });
  }
};

// Optional JWT (for guest access)
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = decoded;
    } catch (error) {
      // Token invalid but continue as guest
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Product validation rules
const productValidation = [
  body('name').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').isLength({ min: 1, max: 500 }).trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('category_id').isInt({ min: 1 })
];

// User validation rules
const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6, max: 128 }),
  body('name').isLength({ min: 1, max: 50 }).trim().escape()
];

// Cart validation rules
const cartValidation = [
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1, max: 100 }),
  body('store_id').isInt({ min: 1 })
];

// Security Headers Configuration
const securityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// API Key Validation (for external integrations)
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const validApiKeys = process.env.API_KEYS?.split(',') || [];
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ 
      error: 'Invalid or missing API key' 
    });
  }
  
  next();
};

// CORS configuration for enhanced security
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'https://smartshopai.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
};

module.exports = {
  rateLimits,
  verifyToken,
  optionalAuth,
  handleValidationErrors,
  productValidation,
  userValidation,
  cartValidation,
  securityConfig,
  validateApiKey,
  corsOptions
}; 