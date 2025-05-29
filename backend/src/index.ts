import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import winston from 'winston';

import config from '@config/app';
// import db from '@config/database'; // Temporarily disabled for demo

// Import routes
import productRoutes from './routes/productRoutes';
import storeRoutes from './routes/storeRoutes';
import priceRoutes from './routes/priceRoutes';
import basketRoutes from './routes/basketRoutes';
import userRoutes from './routes/userRoutes';
import searchRoutes from './routes/searchRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

// Initialize Express app
const app = express();
const PORT = config.port;

// Configure Winston Logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'grocery-compare-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// In development, also log to console
if (config.nodeEnv === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory already exists
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GroceryCompare API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
    status: 'Demo mode - Database disabled'
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/baskets', basketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to GroceryCompare Poland API',
    description: 'Intelligent grocery price comparison platform for Poland',
    version: '1.0.0',
    environment: config.nodeEnv,
    status: 'Demo mode',
    endpoints: {
      health: '/health',
      products: '/api/products',
      stores: '/api/stores',
      prices: '/api/prices',
      baskets: '/api/baskets',
      users: '/api/users',
      search: '/api/search',
      ai: '/api/ai',
    },
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman',
    },
    supportedStores: Object.keys(config.stores),
    categories: config.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
    })),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/health',
      '/api/products',
      '/api/stores',
      '/api/prices',
      '/api/baskets',
      '/api/users',
      '/api/search',
      '/api/ai',
    ],
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server without database for demo
async function startServer() {
  try {
    // Skip database connection for demo
    logger.info('⚠️  Demo mode: Database connection skipped');

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 GroceryCompare API is running on port ${PORT}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`🛡️  CORS Origin: ${config.cors.origin}`);
      
      console.log(`
╔══════════════════════════════════════════════╗
║          🛒 GroceryCompare Poland API         ║
║                  DEMO MODE                   ║
║                                              ║
║  🚀 Server running on: http://localhost:${PORT}  ║
║  📚 API Docs: http://localhost:${PORT}/api/docs ║
║  ❤️  Health Check: http://localhost:${PORT}/health ║
║                                              ║
║  Environment: ${config.nodeEnv.toUpperCase().padEnd(28)} ║
║  Status: Demo (No Database)                  ║
╚══════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app; 