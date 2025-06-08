const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mongoose Schema for MongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'store_manager'],
    default: 'user'
  },
  preferences: {
    language: {
      type: String,
      enum: ['pl', 'en'],
      default: 'pl'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    currency: {
      type: String,
      default: 'PLN'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      price_alerts: { type: Boolean, default: true }
    },
    shopping: {
      max_distance: { type: Number, default: 10 }, // km
      preferred_stores: [{ type: Number }], // store IDs
      budget_limit: { type: Number, default: null },
      dietary_restrictions: [{ type: String }] // 'vegetarian', 'vegan', 'gluten-free'
    }
  },
  shopping_history: [{
    date: { type: Date, default: Date.now },
    items: [{
      product_id: Number,
      store_id: Number,
      quantity: Number,
      price_paid: Number
    }],
    total_amount: Number,
    savings_achieved: Number
  }],
  favorite_products: [{ type: Number }], // product IDs
  price_alerts: [{
    product_id: { type: Number, required: true },
    target_price: { type: Number, required: true },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
  }],
  email_verified: {
    type: Boolean,
    default: false
  },
  verification_token: String,
  reset_password_token: String,
  reset_password_expires: Date,
  last_login: Date,
  login_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user stats
userSchema.methods.getStats = function() {
  return {
    total_purchases: this.shopping_history.length,
    total_spent: this.shopping_history.reduce((sum, order) => sum + order.total_amount, 0),
    total_savings: this.shopping_history.reduce((sum, order) => sum + order.savings_achieved, 0),
    favorite_products_count: this.favorite_products.length,
    active_price_alerts: this.price_alerts.filter(alert => alert.active).length,
    member_since: this.created_at
  };
};

// PostgreSQL Schema (for reference)
const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'store_manager')),
    preferences JSONB DEFAULT '{}',
    shopping_history JSONB DEFAULT '[]',
    favorite_products INTEGER[] DEFAULT '{}',
    price_alerts JSONB DEFAULT '[]',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255), 
    reset_password_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
`;

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  createUserTableSQL
}; 