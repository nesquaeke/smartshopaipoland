'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

interface ShoppingListItem {
  id: number;
  productId: number;
  quantity: number;
  notes: string;
  product: any;
  completed: boolean;
}

interface RouteOptimization {
  optimized_route: any[];
  total_time_minutes: number;
  total_distance_km: number;
  estimated_savings: number;
}

export default function SmartShopping() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimization | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [budget, setBudget] = useState(200);
  const [dietPreference, setDietPreference] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');

  // Multilingual texts
  const texts = {
    pl: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      title: "Smart Shopping",
      subtitle: "AI-Powered Shopping List",
      aiAssistant: "AI Asystent",
      weeklyBudget: "Budżet tygodniowy (PLN)",
      dietPreferences: "Preferencje żywieniowe",
      standardDiet: "Standardowa dieta",
      vegetarian: "Wegetariańska",
      vegan: "Wegańska",
      getRecommendations: "Pobierz rekomendacje AI",
      analyzing: "Analizuję...",
      recommendedProducts: "Rekomendowane produkty:",
      addToList: "Dodaj do listy",
      myShoppingList: "Moja lista zakupów",
      itemsInList: "produktów na liście",
      optimizeRoute: "Optymalizuj trasę",
      routeOptimization: "Optymalizacja trasy",
      estimatedTime: "Szacowany czas",
      totalDistance: "Łączna odległość",
      estimatedSavings: "Szacowane oszczędności",
      minutes: "minut",
      km: "km",
      loadingOptimization: "Optymalizuję trasę...",
      noItems: "Brak produktów na liście",
      addSomeProducts: "Dodaj produkty, aby rozpocząć planowanie zakupów",
      smartFeatures: "Inteligentne funkcje",
      priceComparison: "Porównanie cen",
      budgetTracking: "Śledzenie budżetu",
      routePlanning: "Planowanie trasy"
    },
    en: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      title: "Smart Shopping",
      subtitle: "AI-Powered Shopping List",
      aiAssistant: "AI Assistant",
      weeklyBudget: "Weekly Budget (PLN)",
      dietPreferences: "Diet Preferences",
      standardDiet: "Standard diet",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      getRecommendations: "Get AI Recommendations",
      analyzing: "Analyzing...",
      recommendedProducts: "Recommended products:",
      addToList: "Add to list",
      myShoppingList: "My Shopping List",
      itemsInList: "items in list",
      optimizeRoute: "Optimize Route",
      routeOptimization: "Route Optimization",
      estimatedTime: "Estimated time",
      totalDistance: "Total distance",
      estimatedSavings: "Estimated savings",
      minutes: "minutes",
      km: "km",
      loadingOptimization: "Optimizing route...",
      noItems: "No items in list",
      addSomeProducts: "Add products to start shopping planning",
      smartFeatures: "Smart Features",
      priceComparison: "Price Comparison",
      budgetTracking: "Budget Tracking",
      routePlanning: "Route Planning"
    }
  };

  const t = texts[language];

  const fetchShoppingList = async () => {
    try {
      const response = await fetch('http://localhost:3535/api/shopping-list/guest');
      if (response.ok) {
        const data = await response.json();
        setShoppingList(data.data?.items || []);
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const addToShoppingList = async (productId: number, quantity: number = 1) => {
    try {
      const response = await fetch('http://localhost:3535/api/shopping-list/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest', productId, quantity })
      });

      if (response.ok) {
        fetchShoppingList();
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
        toastDiv.innerHTML = '✅ Dodano do listy zakupów!';
        document.body.appendChild(toastDiv);
        setTimeout(() => document.body.removeChild(toastDiv), 3000);
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  };

  const optimizeRoute = async () => {
    setIsLoading(true);
    try {
      const stores = [
        { id: 1, name: 'Biedronka', lat: 52.2297, lng: 21.0122 },
        { id: 2, name: 'LIDL', lat: 52.2350, lng: 21.0180 },
        { id: 13, name: 'Żabka', lat: 52.2280, lng: 21.0100 }
      ];

      const response = await fetch('http://localhost:3535/api/shopping-route/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest', stores, lat: 52.2297, lng: 21.0122 })
      });

      if (response.ok) {
        const data = await response.json();
        setOptimizedRoute(data.data);
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAiRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3535/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          preferences: { dietType: dietPreference },
          budget
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendations(data.data?.recommended_products || []);
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingList();
    getAiRecommendations();
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Enhanced Header */}
      <header className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r ${isDarkMode ? 'from-gray-700 to-gray-600' : 'from-gray-100 to-gray-200'} px-2 py-1 rounded-full`}>{t.subtitle}</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* Cart Indicator */}
              <div className="relative">
                <button className={`relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                    : 'bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 text-gray-800 hover:from-emerald-200 hover:to-blue-200'
                } shadow-lg hover:shadow-xl`}>
                  <span className="text-xl">🛒</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                      {cart.length}
                    </span>
                  )}
                </button>
                <div className={`text-xs text-center mt-1 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'pl' ? 'Sepetim' : 'My Cart'}
                </div>
              </div>

              <button
                onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 border border-purple-600 text-white hover:from-purple-600 hover:to-indigo-600'
                    : 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 text-purple-800 hover:from-purple-200 hover:to-indigo-200'
                } shadow-lg hover:shadow-xl`}
              >
                {language === 'pl' ? '🇺🇸 EN' : '🇵🇱 PL'}
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border border-yellow-500 text-white hover:from-yellow-500 hover:to-orange-500'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                } shadow-lg hover:shadow-xl`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow-lg`}>
            🤖 {t.title}
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} drop-shadow-sm`}>
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Enhanced AI Preferences Panel */}
          <div className={`rounded-3xl shadow-xl p-8 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🤖 <span className="ml-2">{t.aiAssistant}</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  💰 {t.weeklyBudget}
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className={`w-full p-4 border-2 rounded-2xl transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/30`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  🥗 {t.dietPreferences}
                </label>
                <select
                  value={dietPreference}
                  onChange={(e) => setDietPreference(e.target.value)}
                  className={`w-full p-4 border-2 rounded-2xl transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/30`}
                >
                  <option value="normal">{t.standardDiet}</option>
                  <option value="vegetarian">{t.vegetarian}</option>
                  <option value="vegan">{t.vegan}</option>
                </select>
              </div>
              
              <button
                onClick={getAiRecommendations}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-purple-500"
              >
                {isLoading ? `🤔 ${t.analyzing}` : `✨ ${t.getRecommendations}`}
              </button>
            </div>

            {/* Enhanced AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  🎯 {t.recommendedProducts}
                </h4>
                {aiRecommendations.slice(0, 5).map((product) => (
                  <div key={product.id} className={`p-4 rounded-2xl border transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-purple-900/30 border-purple-700 hover:bg-purple-800/40' 
                      : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{product.category_icon}</span>
                          <div>
                            <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h5>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.brand}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-purple-600">
                          {Math.min(...product.prices.map((p: any) => p.price)).toFixed(2)} zł
                        </p>
                      </div>
                      <button
                        onClick={() => addToShoppingList(product.id)}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all hover:shadow-lg transform hover:scale-105 text-sm"
                      >
                        ➕ {t.addToList}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Shopping List */}
          <div className={`rounded-3xl shadow-xl p-8 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📝 {t.myShoppingList}
              </h3>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-blue-900/50 text-blue-400' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {shoppingList.length} {t.itemsInList}
              </span>
            </div>

            {shoppingList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.noItems}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.addSomeProducts}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {shoppingList.map((item) => (
                  <div key={item.id} className={`p-4 rounded-2xl border transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.product?.category_icon || '📦'}</span>
                        <div>
                          <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.product?.name}</h5>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.product?.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          isDarkMode 
                            ? 'bg-emerald-900/50 text-emerald-400' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shoppingList.length > 0 && (
              <button
                onClick={optimizeRoute}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-blue-500"
              >
                {isLoading ? `🗺️ ${t.loadingOptimization}` : `🚗 ${t.optimizeRoute}`}
              </button>
            )}
          </div>

          {/* Enhanced Route Optimization */}
          <div className={`rounded-3xl shadow-xl p-8 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🗺️ {t.routeOptimization}
            </h3>

            {!optimizedRoute ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t.optimizeRoute}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Route Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={`text-center p-4 rounded-2xl ${
                    isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <div className="text-2xl font-bold text-blue-600">
                      {optimizedRoute.total_time_minutes}
                    </div>
                    <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.minutes}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {t.estimatedTime}
                    </div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-2xl ${
                    isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
                  }`}>
                    <div className="text-2xl font-bold text-green-600">
                      {optimizedRoute.total_distance_km.toFixed(1)}
                    </div>
                    <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.km}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {t.totalDistance}
                    </div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-2xl ${
                    isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <div className="text-2xl font-bold text-purple-600">
                      {optimizedRoute.estimated_savings.toFixed(0)} zł
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {t.estimatedSavings}
                    </div>
                  </div>
                </div>

                {/* Route Steps */}
                <div className="space-y-3">
                  {optimizedRoute.optimized_route.map((stop, index) => (
                    <div key={index} className={`p-4 rounded-2xl border transition-all ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {index === 0 ? '🏠' : index === optimizedRoute.optimized_route.length - 1 ? '🏁' : '🏪'}
                        </span>
                        <div>
                          <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stop.name || `Krok ${index + 1}`}
                          </h5>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stop.address || 'Lokalizacja'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Smart Features Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ✨ {t.smartFeatures}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`rounded-3xl p-8 border shadow-xl transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="text-5xl mb-4">💰</div>
              <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.priceComparison}
              </h4>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Porównujemy ceny w czasie rzeczywistym z wszystkich sklepów w Polsce.
              </p>
            </div>

            <div className={`rounded-3xl p-8 border shadow-xl transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="text-5xl mb-4">📊</div>
              <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.budgetTracking}
              </h4>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Śledź swoje wydatki i otrzymuj inteligentne rekomendacje budżetowe.
              </p>
            </div>

            <div className={`rounded-3xl p-8 border shadow-xl transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700' 
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <div className="text-5xl mb-4">🗺️</div>
              <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.routePlanning}
              </h4>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI optymalizuje Twoją trasę zakupową dla maksymalnej oszczędności czasu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 