'use client';

import { useState, useEffect } from 'react';

interface Dish {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  prep_time: string;
  cook_time: string;
  serves: number;
  category: string;
  restaurant_price: number;
  ingredient_count: number;
}

interface CostAnalysis {
  dish_info: {
    id: number;
    name: string;
    description: string;
    serves: number;
    restaurant_price: number;
  };
  cost_summary: {
    total_cost: number;
    cost_per_serving: number;
    restaurant_price: number;
    restaurant_price_per_serving: number;
    savings: number;
    savings_percentage: number;
  };
  analysis_summary: {
    home_cooking_vs_restaurant: {
      home_cost: number;
      restaurant_cost: number;
      savings: number;
      savings_percentage: number;
      recommendation: string;
    };
    cheapest_shopping_strategy: string;
  };
  ingredients: any[];
  missing_ingredients: any[];
}

interface ShoppingList {
  dish_name: string;
  total_estimated_cost: number;
  items_to_add: any[];
  store_recommendations: any[];
  shopping_tips: string[];
}

export default function YemeklerPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Fetch all dishes
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://localhost:3535/api/polish-dishes');
        const data = await response.json();
        setDishes(data.dishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Get cost analysis for selected dish
  const analyzeDish = async (dishId: number) => {
    setAnalysisLoading(true);
    try {
      const response = await fetch(`http://localhost:3535/api/polish-dishes/${dishId}/cost-analysis`);
      const data = await response.json();
      setCostAnalysis(data);
      
      // Also get shopping list
      const shoppingResponse = await fetch(`http://localhost:3535/api/polish-dishes/${dishId}/shopping-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add_to_cart: true })
      });
      const shoppingData = await shoppingResponse.json();
      setShoppingList(shoppingData);
    } catch (error) {
      console.error('Error analyzing dish:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Add ingredients to cart
  const addToCart = (items: any[]) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    items.forEach(item => {
      const cartItem = {
        id: Date.now() + Math.random(),
        product_id: item.product_name + '_' + item.store,
        product_name: item.product_name,
        product: {
          name: item.product_name,
          price: item.price,
          store: item.store,
          category: 'Yemek Malzemesi'
        },
        quantity: 1,
        store: item.store,
        price: item.price,
        amount: item.amount
      };
      currentCart.push(cartItem);
    });
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Show success message
    alert(`${items.length} malzeme sepete eklendi! 🛒`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin text-6xl mb-4">🍽️</div>
            <p className="text-xl text-gray-600">Polonya yemekleri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🍽️ Polonya Yemekleri Maliyet Analizi
          </h1>
          <p className="text-gray-600">
            Geleneksel Polonya yemeklerini evde yapmanın maliyetini hesaplayın ve tasarruf edin!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Dishes List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Yemek Listesi</h2>
            
            <div className="space-y-4">
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDish?.id === dish.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => {
                    setSelectedDish(dish);
                    analyzeDish(dish.id);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {dish.category}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {dish.difficulty}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          ⏱️ {dish.prep_time} + {dish.cook_time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">
                        {dish.restaurant_price} PLN
                      </div>
                      <div className="text-sm text-gray-500">Restoran fiyatı</div>
                      <div className="text-sm text-gray-500">
                        {dish.serves} kişilik
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Maliyet Analizi</h2>
            
            {!selectedDish ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-500">Analiz için bir yemek seçin</p>
              </div>
            ) : analysisLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⚙️</div>
                <p className="text-gray-500">Analiz yapılıyor...</p>
              </div>
            ) : costAnalysis ? (
              <div className="space-y-6">
                
                {/* Cost Summary */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">{costAnalysis.dish_info.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {costAnalysis.cost_summary.total_cost.toFixed(2)} PLN
                      </div>
                      <div className="text-sm text-gray-600">Evde yapım</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {costAnalysis.cost_summary.restaurant_price} PLN
                      </div>
                      <div className="text-sm text-gray-600">Restoran</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg">
                    <div className={`text-xl font-bold ${
                      costAnalysis.cost_summary.savings > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {costAnalysis.cost_summary.savings > 0 ? '+' : ''}
                      {costAnalysis.cost_summary.savings.toFixed(2)} PLN 
                      ({costAnalysis.cost_summary.savings_percentage}%)
                    </div>
                    <div className="text-sm text-gray-600">
                      {costAnalysis.analysis_summary.home_cooking_vs_restaurant.recommendation}
                    </div>
                  </div>
                </div>

                {/* Shopping Strategy */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🛒 En İyi Alışveriş Stratejisi</h4>
                  <p className="text-sm">
                    <strong>{costAnalysis.analysis_summary.cheapest_shopping_strategy}</strong> mağazasından 
                    en çok malzeme alabilirsiniz.
                  </p>
                </div>

                {/* Shopping List */}
                {shoppingList && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">📝 Alışveriş Listesi</h4>
                    
                    {shoppingList.shopping_tips.map((tip, index) => (
                      <div key={index} className="text-sm text-gray-600 mb-1">
                        {tip}
                      </div>
                    ))}
                    
                    {shoppingList.items_to_add.length > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={() => addToCart(shoppingList.items_to_add)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                          🛒 Tüm Malzemeleri Sepete Ekle ({shoppingList.items_to_add.length} ürün)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Ingredients List */}
                {costAnalysis.ingredients.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">🥘 Bulunan Malzemeler</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {costAnalysis.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{ingredient.name} ({ingredient.amount})</span>
                          <span className="font-bold">
                            {ingredient.cheapest_price} PLN - {ingredient.cheapest_store}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Ingredients */}
                {costAnalysis.missing_ingredients.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3 text-red-800">❗ Eksik Malzemeler</h4>
                    <div className="space-y-1 text-sm">
                      {costAnalysis.missing_ingredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{ingredient.name} ({ingredient.amount})</span>
                          <span className="text-red-600">
                            ~{ingredient.estimated_price} PLN (tahmini)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
} 