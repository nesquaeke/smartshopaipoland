const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

// PostgreSQL Configuration
const pgPool = new Pool({
  user: process.env.PG_USER || 'smartshop',
  host: process.env.PG_HOST || 'localhost', 
  database: process.env.PG_DATABASE || 'smartshopai',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// MongoDB Configuration  
const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartshopai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Redis Configuration (for caching)
const redis = require('redis');
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

// Database Health Check
const healthCheck = async () => {
  const health = {
    postgres: false,
    mongodb: false,
    redis: false,
    timestamp: new Date().toISOString()
  };

  try {
    // PostgreSQL Health
    const pgResult = await pgPool.query('SELECT NOW()');
    health.postgres = true;
  } catch (err) {
    console.warn('PostgreSQL health check failed:', err.message);
  }

  try {
    // MongoDB Health
    if (mongoose.connection.readyState === 1) {
      health.mongodb = true;
    }
  } catch (err) {
    console.warn('MongoDB health check failed:', err.message);
  }

  try {
    // Redis Health
    await redisClient.ping();
    health.redis = true;
  } catch (err) {
    console.warn('Redis health check failed:', err.message);
  }

  return health;
};

module.exports = {
  pgPool,
  mongoConnect,
  redisClient,
  healthCheck
}; 