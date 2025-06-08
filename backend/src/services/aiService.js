const axios = require('axios');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  // Price prediction based on historical data
  async predictPrices(productId, historicalPrices) {
    try {
      const prompt = `
        Analyze the following price history for product ID ${productId} and predict the next week's prices:
        ${JSON.stringify(historicalPrices)}
        
        Consider factors like:
        - Seasonal trends
        - Historical patterns
        - Market volatility
        - Polish grocery market specifics
        
        Return a JSON object with predicted prices for each store and confidence scores.
      `;

      if (!this.openaiApiKey) {
        // Fallback algorithm if no OpenAI key
        return this.fallbackPricePrediction(historicalPrices);
      }

      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Price Prediction Error:', error);
      return this.fallbackPricePrediction(historicalPrices);
    }
  }

  // Smart shopping recommendations
  async getShoppingRecommendations(userId, cartItems, userPreferences) {
    try {
      const prompt = `
        Generate smart shopping recommendations for a Polish grocery shopper with the following:
        
        Cart Items: ${JSON.stringify(cartItems)}
        User Preferences: ${JSON.stringify(userPreferences)}
        
        Provide recommendations for:
        1. Alternative cheaper products
        2. Bulk buying opportunities
        3. Optimal shopping route
        4. Budget optimization tips
        5. Seasonal alternatives
        
        Consider Polish shopping habits and store availability.
        Return structured JSON with specific recommendations.
      `;

      if (!this.openaiApiKey) {
        return this.fallbackRecommendations(cartItems, userPreferences);
      }

      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      return this.fallbackRecommendations(cartItems, userPreferences);
    }
  }

  // Meal planning based on cart and preferences
  async generateMealPlan(cartItems, familySize, dietaryRestrictions, budget) {
    try {
      const prompt = `
        Create a weekly meal plan for a Polish family with:
        - Family size: ${familySize}
        - Dietary restrictions: ${dietaryRestrictions.join(', ')}
        - Budget: ${budget} PLN
        - Available ingredients: ${cartItems.map(item => item.name).join(', ')}
        
        Include traditional Polish dishes and provide:
        1. 7-day meal plan
        2. Additional ingredients needed
        3. Cost breakdown
        4. Cooking tips
        
        Return structured JSON.
      `;

      if (!this.openaiApiKey) {
        return this.fallbackMealPlan(cartItems, familySize, budget);
      }

      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Meal Plan Error:', error);
      return this.fallbackMealPlan(cartItems, familySize, budget);
    }
  }

  // Product sentiment analysis from reviews
  async analyzeProductSentiment(reviews) {
    try {
      const reviewTexts = reviews.map(r => r.text).join('\n');
      
      const prompt = `
        Analyze the sentiment of these product reviews in Polish and English:
        ${reviewTexts}
        
        Provide:
        1. Overall sentiment score (0-10)
        2. Key positive points
        3. Key negative points
        4. Recommendation summary
        
        Return JSON format.
      `;

      if (!this.openaiApiKey) {
        return this.fallbackSentimentAnalysis(reviews);
      }

      const response = await axios.post(this.apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.2
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Sentiment Analysis Error:', error);
      return this.fallbackSentimentAnalysis(reviews);
    }
  }

  // Fallback algorithms when AI service is unavailable
  fallbackPricePrediction(historicalPrices) {
    const predictions = {};
    
    for (const store in historicalPrices) {
      const prices = historicalPrices[store];
      const average = prices.reduce((a, b) => a + b, 0) / prices.length;
      const volatility = Math.sqrt(prices.reduce((sq, price) => sq + Math.pow(price - average, 2), 0) / prices.length);
      
      predictions[store] = {
        predicted_price: Math.round((average + (Math.random() - 0.5) * volatility * 0.5) * 100) / 100,
        confidence: Math.max(0.4, 0.9 - volatility / average)
      };
    }
    
    return { predictions, source: 'fallback_algorithm' };
  }

  fallbackRecommendations(cartItems, userPreferences) {
    const recommendations = {
      alternatives: cartItems.slice(0, 3).map(item => ({
        original_product: item.name,
        alternative: `Generic ${item.category}`,
        savings: Math.round(item.price * 0.1 * 100) / 100,
        reason: 'Store brand alternative'
      })),
      bulk_opportunities: [
        {
          product: cartItems[0]?.name || 'Products',
          quantity: 3,
          savings: '15%',
          reason: 'Multi-buy discount'
        }
      ],
      budget_tips: [
        'Shop at discount stores like Biedronka for basics',
        'Check weekly promotions',
        'Buy seasonal produce',
        'Use store loyalty cards'
      ],
      source: 'rule_based_system'
    };
    
    return recommendations;
  }

  fallbackMealPlan(cartItems, familySize, budget) {
    const polishDishes = [
      'Żurek with sausage',
      'Pierogi with potato',
      'Kotlet schabowy',
      'Bigos (sauerkraut stew)',
      'Rosół (chicken soup)',
      'Kielbasa with kapusta',
      'Placki ziemniaczane'
    ];
    
    return {
      meal_plan: polishDishes.slice(0, 7).map((dish, index) => ({
        day: index + 1,
        dish,
        estimated_cost: Math.round(budget / 7 * 100) / 100
      })),
      total_cost: budget,
      source: 'traditional_polish_recipes'
    };
  }

  fallbackSentimentAnalysis(reviews) {
    const positiveKeywords = ['dobry', 'świetny', 'polecam', 'good', 'great', 'excellent'];
    const negativeKeywords = ['zły', 'słaby', 'nie polecam', 'bad', 'poor', 'terrible'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    reviews.forEach(review => {
      const text = review.text.toLowerCase();
      positiveKeywords.forEach(keyword => {
        if (text.includes(keyword)) positiveCount++;
      });
      negativeKeywords.forEach(keyword => {
        if (text.includes(keyword)) negativeCount++;
      });
    });
    
    const score = Math.max(1, Math.min(10, 5 + (positiveCount - negativeCount)));
    
    return {
      sentiment_score: score,
      total_reviews: reviews.length,
      recommendation: score > 6 ? 'Recommended' : score > 4 ? 'Mixed reviews' : 'Not recommended',
      source: 'keyword_analysis'
    };
  }

  // Cache management for AI responses
  getCacheKey(method, params) {
    return `ai_${method}_${JSON.stringify(params)}`;
  }

  async getCachedResponse(cacheKey) {
    // Implementation would use Redis or similar caching system
    return null;
  }

  async setCachedResponse(cacheKey, data, ttl = 3600) {
    // Implementation would use Redis or similar caching system
    return true;
  }
}

module.exports = new AIService(); 