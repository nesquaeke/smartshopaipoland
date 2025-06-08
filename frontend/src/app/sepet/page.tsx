'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import API_ENDPOINTS from '../../config/api';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_description: string;
  category_icon: string;
  brand: string;
  store_name: string;
  store_id: number;
  price: number;
  quantity: number;
  original_price?: number;
  is_promotion?: boolean;
  discount_percentage?: number;
}

interface Alternative {
  store_name: string;
  price: number;
  savings: number;
  distance: string;
  is_available: boolean;
}

interface Product {
  id: number;
  name: string;
  category_icon: string;
  alternatives: Alternative[];
}

interface RouteOptimization {
  total_distance: string;
  total_time: string;
  total_savings: number;
  stores: {
    name: string;
    address: string;
    items: string[];
    distance: string;
    order: number;
  }[];
}

export default function SepetPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [alternatives, setAlternatives] = useState<{[key: number]: Alternative[]}>({});
  const [routeOptimization, setRouteOptimization] = useState<RouteOptimization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const [showAlternatives, setShowAlternatives] = useState<{[key: number]: boolean}>({});
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<any[]>([]);

  const texts = {
    pl: {
      title: "Mój Sepet",
      empty: "Sepet pusty",
      emptyDesc: "Dodaj produkty do sepetu, aby móc porównać ceny i zoptymalizować trasę zakupów",
      total: "Razem",
      savings: "Oszczędności",
      alternatives: "Alternatywy",
      betterPrice: "Lepsza cena dostępna",
      optimizeRoute: "Optymalizuj trasę",
      routePlanning: "Planowanie trasy",
      smartSuggestions: "Inteligentne sugestie",
      priceAlert: "Powiadomienie o cenie",
      updateQuantity: "Aktualizuj ilość",
      removeItem: "Usuń z sepetu",
      addToCart: "Dodaj do sepetu",
      viewAlternatives: "Zobacz alternatywy",
      hideAlternatives: "Ukryj alternatywy",
      acceptSuggestion: "Zaakceptuj sugestię",
      startShopping: "Rozpocznij zakupy"
    },
    en: {
      title: "My Cart",
      empty: "Cart is empty",
      emptyDesc: "Add products to cart to compare prices and optimize shopping route",
      total: "Total",
      savings: "Savings",
      alternatives: "Alternatives",
      betterPrice: "Better price available",
      optimizeRoute: "Optimize route",
      routePlanning: "Route Planning",
      smartSuggestions: "Smart Suggestions",
      priceAlert: "Price Alert",
      updateQuantity: "Update quantity",
      removeItem: "Remove from cart",
      addToCart: "Add to cart",
      viewAlternatives: "View alternatives",
      hideAlternatives: "Hide alternatives",
      acceptSuggestion: "Accept suggestion",
      startShopping: "Start shopping"
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchCartItems();
    generateSmartSuggestions();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      analyzeAlternatives();
      optimizeShoppingRoute();
    }
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      // Get cart data from localStorage
      const savedCart = localStorage.getItem('smartshop_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          // Validate cart structure
          const validatedCart = cart.filter((item: any) => {
            return item && 
                   typeof item.product_id === 'number' && 
                   typeof item.product_name === 'string' && 
                   typeof item.store_name === 'string' &&
                   typeof item.price === 'number' &&
                   typeof item.quantity === 'number';
          });
          
          setCartItems(validatedCart);
          
          // If we found invalid items, update localStorage with cleaned data
          if (validatedCart.length !== cart.length) {
            localStorage.setItem('smartshop_cart', JSON.stringify(validatedCart));
            console.log('Cleaned invalid cart items');
          }
        } catch (parseError) {
          console.error('Error parsing cart data:', parseError);
          // Clear corrupted cart data
          localStorage.removeItem('smartshop_cart');
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAlternatives = async () => {
    // Simulate AI price analysis
    const alternativesMap: {[key: number]: Alternative[]} = {};
    
    cartItems.forEach(item => {
      // Generate mock alternatives with AI analysis
      alternativesMap[item.product_id] = [
        {
          store_name: "LIDL",
          price: item.price - Math.random() * 2,
          savings: Math.random() * 3 + 1,
          distance: "0.8 km",
          is_available: true
        },
        {
          store_name: "Biedronka",
          price: item.price - Math.random() * 1.5,
          savings: Math.random() * 2 + 0.5,
          distance: "1.2 km",
          is_available: true
        },
        {
          store_name: "Carrefour",
          price: item.price + Math.random() * 1,
          savings: -Math.random() * 1,
          distance: "2.1 km",
          is_available: Math.random() > 0.3
        }
      ].sort((a, b) => a.price - b.price);
    });
    
    setAlternatives(alternativesMap);
  };

  const optimizeShoppingRoute = async () => {
    if (cartItems.length === 0) return;

    // AI route optimization simulation
    const storeGroups = cartItems.reduce((acc, item) => {
      if (!acc[item.store_name]) {
        acc[item.store_name] = [];
      }
      acc[item.store_name].push(item.product_name);
      return acc;
    }, {} as {[key: string]: string[]});

    const route: RouteOptimization = {
      total_distance: "3.2 km",
      total_time: "25 min",
      total_savings: cartItems.reduce((sum, item) => sum + (item.original_price || 0) - item.price, 0),
      stores: Object.entries(storeGroups).map(([storeName, items], index) => ({
        name: storeName,
        address: `ul. Przykładowa ${index + 1}, Warszawa`,
        items,
        distance: `${(index * 0.8 + 0.5).toFixed(1)} km`,
        order: index + 1
      }))
    };

    setRouteOptimization(route);
  };

  const generateSmartSuggestions = async () => {
    // AI-powered smart suggestions
    const suggestions = [
      {
        id: 1,
        type: 'price_optimization',
        title: 'Zamień na tańszą alternatywę',
        description: 'Mleko 3.2% w LIDL jest o 1.20 zł tańsze',
        savings: 1.20,
        action: 'replace_item',
        confidence: 95
      },
      {
        id: 2,
        type: 'bundle_suggestion',
        title: 'Dodatkowo polecamy',
        description: 'Klienci kupujący te produkty często dodają chleb pełnoziarnisty',
        savings: 0,
        action: 'add_item',
        confidence: 87
      },
      {
        id: 3,
        type: 'promotion_alert',
        title: 'Promocja 2+1 gratis',
        description: 'Jogurt naturalny ma promocję 2+1 gratis w Biedronce',
        savings: 3.50,
        action: 'promotion',
        confidence: 100
      }
    ];

    setSmartSuggestions(suggestions);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.product_id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('smartshop_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('smartshop_cart', JSON.stringify(updatedCart));
  };

  const toggleAlternatives = (productId: number) => {
    setShowAlternatives(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      const originalPrice = item.original_price || item.price * 1.2;
      return sum + ((originalPrice - item.price) * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} zł`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🛒</div>
          <div className="text-xl text-gray-600">Ładowanie sepetu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-3xl mr-3">🛒</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    SmartShopAI
                  </h1>
                  <span className="text-xs text-gray-500 font-medium">Powered by AI</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Produkty
              </Link>
              <Link href="/stores" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sklepy
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Kategorie
              </Link>
              <span className="text-blue-600 font-bold border-b-2 border-blue-600">
                {t.title}
              </span>
            </nav>
            <button
              onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
              className="px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 text-purple-800 hover:from-purple-200 hover:to-indigo-200 transition-all"
            >
              {language === 'pl' ? '🇺🇸' : '🇵🇱'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-4">🛒</span>
            {t.title}
            {cartItems.length > 0 && (
              <span className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg">
                {cartItems.length}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Główna</Link>
            <span>/</span>
            <span className="text-blue-600">{t.title}</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.empty}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{t.emptyDesc}</p>
            <Link 
              href="/products"
              className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              🛍️ Rozpocznij zakupy
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Produkty w sepecie</h3>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{t.total}</div>
                      <div className="text-2xl font-bold text-emerald-600">{formatPrice(calculateTotal())}</div>
                    </div>
                    {calculateSavings() > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{t.savings}</div>
                        <div className="text-2xl font-bold text-green-600">-{formatPrice(calculateSavings())}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.product_id}-${item.store_id}`} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <span className="text-4xl">{item.category_icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">{item.product_name}</h4>
                            <p className="text-gray-600 text-sm">{item.product_description}</p>
                            <p className="text-gray-500 text-xs">{item.brand}</p>
                            <div className="flex items-center mt-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {item.store_name}
                              </span>
                              {item.is_promotion && (
                                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-sm animate-pulse">
                                  -{item.discount_percentage}% PROMOCJA
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <div className="text-right">
                            <div className="text-xl font-bold text-emerald-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.original_price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(item.original_price * item.quantity)}
                              </div>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 bg-gray-100 rounded font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            🗑️ {t.removeItem}
                          </button>
                        </div>
                      </div>

                      {/* Price Alternatives */}
                      {alternatives[item.product_id] && alternatives[item.product_id].length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => toggleAlternatives(item.product_id)}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <span className="text-sm font-medium text-blue-600">
                              💡 {t.betterPrice} - oszczędź do {formatPrice(Math.max(...alternatives[item.product_id].map(alt => alt.savings)))}
                            </span>
                            <span className="text-blue-600">
                              {showAlternatives[item.product_id] ? '▼' : '▶'}
                            </span>
                          </button>
                          
                          {showAlternatives[item.product_id] && (
                            <div className="mt-3 space-y-2">
                              {alternatives[item.product_id].map((alt, index) => (
                                <div 
                                  key={index}
                                  className={`flex justify-between items-center p-3 rounded-lg ${
                                    alt.savings > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                                  }`}
                                >
                                  <div>
                                    <div className="font-medium">{alt.store_name}</div>
                                    <div className="text-sm text-gray-600">{alt.distance}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">{formatPrice(alt.price)}</div>
                                    {alt.savings > 0 && (
                                      <div className="text-sm text-green-600">-{formatPrice(alt.savings)}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Suggestions */}
              {smartSuggestions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🤖</span>
                    {t.smartSuggestions}
                  </h3>
                  
                  <div className="space-y-4">
                    {smartSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{suggestion.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              {suggestion.savings > 0 && (
                                <span className="text-green-600 font-medium">
                                  💰 Oszczędność: {formatPrice(suggestion.savings)}
                                </span>
                              )}
                              <span className="text-blue-600">
                                ✨ Pewność: {suggestion.confidence}%
                              </span>
                            </div>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            {t.acceptSuggestion}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Route Optimization */}
              {routeOptimization && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🗺️</span>
                    {t.routePlanning}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="font-bold text-blue-600">{routeOptimization.total_distance}</div>
                        <div className="text-sm text-gray-600">Całkowita trasa</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="font-bold text-green-600">{routeOptimization.total_time}</div>
                        <div className="text-sm text-gray-600">Czas zakupów</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {routeOptimization.stores.map((store, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {store.order}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{store.name}</div>
                            <div className="text-sm text-gray-600">{store.items.length} produktów</div>
                          </div>
                          <div className="text-sm text-gray-500">{store.distance}</div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                      🚗 {t.startShopping}
                    </button>
                  </div>
                </div>
              )}

              {/* Price Alerts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🔔</span>
                  {t.priceAlert}
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">Mleko 3.2% - Łaciate</div>
                    <div className="text-sm text-yellow-700">Cena spadła o 15% w LIDL</div>
                    <div className="text-xs text-yellow-600 mt-1">2 min temu</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800">Promocja 2+1 gratis</div>
                    <div className="text-sm text-green-700">Jogurt naturalny w Biedronce</div>
                    <div className="text-xs text-green-600 mt-1">5 min temu</div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700">
                  ⚙️ Skonfiguruj alerty
                </button>
              </div>

              {/* Total Summary */}
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Podsumowanie</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Produkty ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-bold">{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-green-200">
                      <span>Oszczędności</span>
                      <span className="font-bold">-{formatPrice(calculateSavings())}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Razem</span>
                      <span>{formatPrice(calculateTotal() - calculateSavings())}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-white text-emerald-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                  💳 Przejdź do płatności
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 