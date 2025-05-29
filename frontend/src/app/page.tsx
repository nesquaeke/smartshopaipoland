'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  category_id: number;
  category_name: string;
  category_icon: string;
  prices: {
    store_name: string;
    price: number;
    is_promotion?: boolean;
    discount_percentage?: number;
  }[];
}

interface Store {
  id: number;
  name: string;
  type: string;
  location_count: number;
  logo: string;
  categories: string[];
  website: string;
}

interface Category {
  id: number;
  name: string;
  name_pl: string;
  icon: string;
  product_count: number;
}

interface Stats {
  total_products: number;
  total_stores: number;
  total_categories: number;
}

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total_products: 0,
    total_stores: 0,
    total_categories: 13
  });
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  
  // New state for enhanced features
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  
  // Theme and language states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const [cart, setCart] = useState<any[]>([]);
  
  // Multilingual texts
  const texts = {
    pl: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      heroTitle: "Inteligentne porównanie cen",
      heroSubtitle: "produktów spożywczych w Polsce",
      heroDescription: "Oszczędzaj czas i pieniądze dzięki AI! Porównujemy ceny z największych sieci handlowych w Polsce.",
      searchPlaceholder: "Czego szukasz? (np. banany, mleko, czekolada)",
      searchButton: "Szukaj AI",
      searchTip: "najtańsze mleko lub promocje na owoce",
      products: "Produktów",
      stores: "Sieci handlowych",
      categories: "Kategorii",
      savings: "Średnia oszczędność",
      popularCategories: "Popularne kategorie",
      nearbyStores: "Sklepy w pobliżu",
      bestOffers: "Najlepsze oferty",
      activePromotions: "Promocje aktywne",
      addToFavorites: "Dodaj do ulubionych",
      addToCompare: "Dodaj do porównania",
      trackPrice: "Śledź cenę",
      addToCart: "Dodaj",
      viewProduct: "Zobacz",
      compareProducts: "Porównanie produktów",
      detailedComparison: "Szczegółowe porównanie",
      aiFeatures: "Funkcje AI",
      aiDescription: "Nasze rozwiązania AI pomagają znaleźć najlepsze oferty i zaplanować zakupy"
    },
    en: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      heroTitle: "Smart price comparison",
      heroSubtitle: "for groceries in Poland",
      heroDescription: "Save time and money with AI! We compare prices from the largest retail chains in Poland.",
      searchPlaceholder: "What are you looking for? (e.g. bananas, milk, chocolate)",
      searchButton: "AI Search",
      searchTip: "cheapest milk or fruit promotions",
      products: "Products",
      stores: "Store Chains",
      categories: "Categories",
      savings: "Average Savings",
      popularCategories: "Popular Categories",
      nearbyStores: "Nearby Stores",
      bestOffers: "Best Offers",
      activePromotions: "Active Promotions",
      addToFavorites: "Add to Favorites",
      addToCompare: "Add to Compare",
      trackPrice: "Track Price",
      addToCart: "Add",
      viewProduct: "View",
      compareProducts: "Product Comparison",
      detailedComparison: "Detailed Comparison",
      aiFeatures: "AI Features",
      aiDescription: "Our AI solutions help find the best deals and plan your shopping"
    }
  };
  
  const t = texts[language];
  
  const [userPreferences, setUserPreferences] = useState({
    maxDistance: 5, // km
    preferredStores: ['Biedronka', 'LIDL'],
    dietType: 'normal', // vegan, vegetarian, normal
    budget: 200 // weekly budget in PLN
  });

  useEffect(() => {
    fetchData();
    fetchStats();
    fetchNearbyStores();
  }, []);

  const fetchData = async () => {
    try {
      const [trendingRes, productsRes, storesRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3535/api/products/trending'),
        fetch('http://localhost:3535/api/products?limit=6'),
        fetch('http://localhost:3535/api/stores'),
        fetch('http://localhost:3535/api/products/categories')
      ]);

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json();
        setTrendingProducts(trendingData.data || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setAllProducts(productsData.data || []);
      }

      if (storesRes.ok) {
        const storesData = await storesRes.json();
        setStores(storesData.data || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [healthResponse, categoriesResponse] = await Promise.all([
        fetch('http://localhost:3535/health'),
        fetch('http://localhost:3535/api/products/categories')
      ]);
      
      const healthData = await healthResponse.json();
      const categoriesData = await categoriesResponse.json();
      
      setStats({
        total_products: healthData.total_products || 70,
        total_stores: healthData.total_stores || 50,
        total_categories: categoriesData.data?.length || 13
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback values
      setStats({
        total_products: 70,
        total_stores: 50,
        total_categories: 13
      });
    }
  };

  const fetchNearbyStores = async () => {
    try {
      // Use Warsaw coordinates as default
      const response = await fetch('http://localhost:3535/api/stores/nearby?lat=52.2297&lng=21.0122');
      if (response.ok) {
        const data = await response.json();
        setNearbyStores(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Save to search history
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 4)]); // Keep last 5 searches
      }
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const getBestPrice = (prices: any[]) => {
    return Math.min(...prices.map(p => p.price));
  };

  const getBestStore = (prices: any[]) => {
    const bestPrice = getBestPrice(prices);
    return prices.find(p => p.price === bestPrice);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} zł`;
  };

  const addToCart = async (productId: number, storeId: number) => {
    try {
      const product = allProducts.find(p => p.id === productId);
      const store = stores.find(s => s.id === storeId);
      
      if (!product || !store) {
        alert('❌ Produkt lub sklep nie został znaleziony');
        return;
      }

      const price = product.prices.find(p => p.store_name === store.name);
      if (!price) {
        alert('❌ Produkt niedostępny w tym sklepie');
        return;
      }

      // Calculate savings compared to highest price
      const highestPrice = Math.max(...product.prices.map(p => p.price));
      const savings = highestPrice - price.price;

      // Add to local cart
      const cartItem = {
        productId,
        storeId,
        product,
        store,
        price: price.price,
        quantity: 1,
        savings,
        isPromotion: price.is_promotion,
        discountPercentage: price.discount_percentage || 0
      };

      setCart(prev => {
        const existingItem = prev.find(item => item.productId === productId && item.storeId === storeId);
        if (existingItem) {
          return prev.map(item => 
            item.productId === productId && item.storeId === storeId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, cartItem];
        }
      });

      // API call to backend
      const response = await fetch('http://localhost:3535/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'guest',
          productId,
          storeId,
          quantity: 1
        })
      });

      if (response.ok) {
        // Show success message with savings
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
        toastDiv.innerHTML = `✅ ${product.name} dodany do koszyka!<br/>💰 Oszczędzasz: ${savings.toFixed(2)} zł`;
        document.body.appendChild(toastDiv);
        setTimeout(() => document.body.removeChild(toastDiv), 4000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Błąd podczas dodawania do koszyka');
    }
  };

  const addToFavorites = async (productId: number) => {
    try {
      const response = await fetch('http://localhost:3535/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'guest',
          productId
        })
      });

      if (response.ok) {
        setFavoriteItems(prev => [...prev, productId]);
        // Show success message with better styling
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
        toastDiv.innerHTML = '❤️ Produto dodany do ulubionych!';
        document.body.appendChild(toastDiv);
        setTimeout(() => document.body.removeChild(toastDiv), 3000);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      // Show error message
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
      toastDiv.innerHTML = '❌ Błąd podczas dodawania do ulubionych';
      document.body.appendChild(toastDiv);
      setTimeout(() => document.body.removeChild(toastDiv), 3000);
    }
  };

  const addPriceTracking = async (productId: number, targetPrice: number) => {
    try {
      const response = await fetch('http://localhost:3535/api/price-tracking/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'guest',
          productId,
          targetPrice
        })
      });

      if (response.ok) {
        alert('🔔 Śledzenie ceny aktywowane!');
      }
    } catch (error) {
      console.error('Error adding price tracking:', error);
      alert('❌ Błąd podczas aktywowania śledzenia ceny');
    }
  };

  const addToCompare = (product: any) => {
    if (compareList.length >= 3) {
      alert('⚡ Możesz porównać maksymalnie 3 produkty naraz!');
      return;
    }
    if (compareList.find(p => p.id === product.id)) {
      alert('📝 Ten produkt jest już na liście porównania!');
      return;
    }
    setCompareList(prev => [...prev, product]);
    // Show success message
    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
    toastDiv.innerHTML = `⚖️ ${product.name} dodany do porównania (${compareList.length + 1}/3)`;
    document.body.appendChild(toastDiv);
    setTimeout(() => document.body.removeChild(toastDiv), 3000);
  };

  const removeFromCompare = (productId: number) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  // Get smart product recommendations based on cart
  const getRecommendations = () => {
    if (cart.length === 0) return [];
    
    const cartCategories = [...new Set(cart.map(item => item.product.category_id))];
    const recommendations = allProducts.filter(product => 
      cartCategories.includes(product.category_id) && 
      !cart.some(item => item.product.id === product.id)
    ).slice(0, 3);
    
    return recommendations;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t.siteName}
                  </h1>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r ${isDarkMode ? 'from-gray-700 to-gray-600' : 'from-gray-100 to-gray-200'} px-2 py-1 rounded-full`}>{t.motto}</span>
                </div>
                <div className={`ml-4 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600' : 'bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200'}`}>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>v.0.1.1</span>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-4">
              <div className="relative group">
                <Link href="/products" className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200'
                } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}>
                  📦 Produkty
                </Link>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="p-4">
                    <div className="space-y-2">
                      <Link href="/products?category=1" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🍞</span>
                          <span>Pieczywo</span>
                        </div>
                      </Link>
                      <Link href="/products?category=2" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🥛</span>
                          <span>Nabiał</span>
                        </div>
                      </Link>
                      <Link href="/products?category=7" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🍭</span>
                          <span>Słodycze</span>
                        </div>
                      </Link>
                    </div>
                    <div className="border-t mt-3 pt-3">
                      <Link href="/products" className="block text-center text-blue-600 font-medium hover:text-blue-700">
                        Zobacz wszystkie →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <Link href="/stores" className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200'
                } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}>
                  🏪 Sklepy
                </Link>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="p-4">
                    <div className="space-y-2">
                      <Link href="/stores?type=discount" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🏪</span>
                          <span>Dyskonty</span>
                        </div>
                      </Link>
                      <Link href="/stores?type=hypermarket" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🏬</span>
                          <span>Hipermarkety</span>
                        </div>
                      </Link>
                      <Link href="/stores?type=convenience" className="block px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <span className="mr-2">🏢</span>
                          <span>Sklepy osiedlowe</span>
                        </div>
                      </Link>
                    </div>
                    <div className="border-t mt-3 pt-3">
                      <Link href="/stores" className="block text-center text-blue-600 font-medium hover:text-blue-700">
                        Zobacz wszystkie →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link href="/promotions" className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30' : 'text-red-700 hover:text-red-800 bg-red-100/50 hover:bg-red-200'
                } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-red-800 hover:border-red-700' : 'border-red-200 hover:border-red-300'}`}>
                  🔥 Promocje
                </Link>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-lg font-bold text-red-600">Aktualne promocje</div>
                      <div className="text-sm text-gray-500">Oszczędzaj do 50%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-sm">🥛 Mleko Łaciate</span>
                        <span className="text-red-600 font-bold text-sm">-25%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-sm">🍞 Chleb</span>
                        <span className="text-red-600 font-bold text-sm">-15%</span>
                      </div>
                    </div>
                    <div className="border-t mt-3 pt-3">
                      <Link href="/promotions" className="block text-center text-red-600 font-medium hover:text-red-700">
                        Zobacz wszystkie promocje →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/categories" className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200'
              } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}>
                📋 Kategorie
              </Link>
              
              <Link href="/smart-shopping" className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white px-5 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 border border-emerald-500">
                🛒 Smart Shopping
              </Link>
              
              <Link href="/ai" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 border border-blue-500">
                🤖 AI Asystent
              </Link>
              
              <Link href="/features" className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'text-orange-400 hover:text-orange-300 bg-orange-900/20 hover:bg-orange-800/30' : 'text-orange-700 hover:text-orange-800 bg-orange-100/50 hover:bg-orange-200'
              } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-orange-800 hover:border-orange-700' : 'border-orange-200 hover:border-orange-300'}`}>
                🚀 Demo Features
              </Link>
              
              {/* Language Switcher */}
              <div className="flex items-center space-x-3">
                {/* Cart Indicator */}
                <div className="relative">
                  <button
                    className={`relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                        : 'bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 text-gray-800 hover:from-emerald-200 hover:to-blue-200'
                    } shadow-lg hover:shadow-xl`}
                  >
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
                  } shadow-md hover:shadow-lg border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {language === 'pl' ? '🇺🇸 EN' : '🇵🇱 PL'}
                </button>
                
                {/* Dark Mode Toggle */}
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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className={`text-5xl font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow-lg`}>
            {t.heroTitle}
            <span className="block text-4xl text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text drop-shadow-sm">
              {t.heroSubtitle}
            </span>
          </h2>
          <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} drop-shadow-sm`}>
            {t.heroDescription}
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className={`flex rounded-3xl shadow-2xl border-2 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-emerald-300'
              }`}>
                <div className="flex-1 relative">
                  <span className={`absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={t.searchPlaceholder}
                    className={`w-full pl-16 pr-6 py-6 text-lg border-0 rounded-l-3xl focus:outline-none focus:ring-4 font-medium transition-all ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-emerald-500/30' 
                        : 'bg-white text-gray-800 placeholder-gray-500 focus:ring-emerald-500/30'
                    }`}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-r-3xl font-bold transition-all hover:shadow-2xl hover:scale-105 border-l-2 border-emerald-500"
                >
                  ✨ {t.searchButton}
                </button>
              </div>
              
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-gray-800">🕐 Ostatnie wyszukiwania</h4>
                      <button 
                        onClick={clearSearchHistory}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Wyczyść
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch();
                          }}
                          className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition-colors"
                        >
                          🔍 {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
                💡 <span className="text-blue-600 font-bold">Tip:</span> "{t.searchTip}"
              </div>
            </div>
          </div>

          {/* Updated Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className={`rounded-3xl p-8 border transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-emerald-500' 
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-white/50 hover:border-emerald-300'
            }`}>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text">{stats.total_products}+</div>
              <div className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{t.products}</div>
            </div>
            <div className={`rounded-3xl p-8 border transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-blue-500' 
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-white/50 hover:border-blue-300'
            }`}>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">{stats.total_stores}</div>
              <div className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{t.stores}</div>
            </div>
            <div className={`rounded-3xl p-8 border transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-purple-500' 
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-white/50 hover:border-purple-300'
            }`}>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">{stats.total_categories}</div>
              <div className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{t.categories}</div>
            </div>
            <div className={`rounded-3xl p-8 border transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-green-500' 
                : 'bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-white/50 hover:border-green-300'
            }`}>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">15%</div>
              <div className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{t.savings}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.popularCategories}</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <div key={category.id} className="relative group">
              <Link
                href={`/products?category=${category.id}`}
                className="block bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:scale-105 cursor-pointer relative overflow-hidden"
              >
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform filter group-hover:drop-shadow-lg">
                    {category.icon}
                  </div>
                  <div className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{category.name_pl}</div>
                  <div className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{category.product_count} produktów</div>
                </div>
              </Link>

              {/* Hover Dropdown Menu */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <h4 className="font-bold text-gray-900">{category.name_pl}</h4>
                  </div>
                  
                  {/* Sample products from this category */}
                  <div className="space-y-3">
                    {allProducts.filter(product => product.category_id === category.id).slice(0, 4).map((product) => {
                      const bestPrice = getBestPrice(product.prices);
                      const hasPromotion = product.prices.some(p => p.is_promotion);
                      
                      return (
                        <div key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{product.category_icon}</span>
                            <div>
                              <div className="font-medium text-sm text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.brand}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-sm">{formatPrice(bestPrice)}</div>
                            {hasPromotion && (
                              <div className="text-xs text-red-600 font-medium">PROMOCJA</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Link
                    href={`/products?category=${category.id}`}
                    className="block mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Zobacz wszystkie ({category.product_count})
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map & Nearby Stores Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-900">{t.nearbyStores}</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Warszawa centrum
          </span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mock Map */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20"></div>
              
              {/* Mock map with store pins */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1">
                  {Array.from({length: 48}, (_, i) => (
                    <div key={i} className="bg-white/30 rounded"></div>
                  ))}
                </div>
                
                {/* Store pins */}
                {nearbyStores.slice(0, 6).map((store, index) => (
                  <div 
                    key={store.id}
                    className="absolute group cursor-pointer transform transition-all duration-300 hover:scale-125"
                    style={{
                      left: `${20 + (index * 12)}%`,
                      top: `${15 + (index * 10)}%`
                    }}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                      {index + 1}
                    </div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <div className="text-sm font-medium">{store.name}</div>
                      <div className="text-xs text-gray-500">{store.distance}km</div>
                    </div>
                  </div>
                ))}
                
                {/* Center marker (user location) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Twoja lokalizacja
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium">
                🗺️ Interaktywna mapa
              </div>
            </div>
          </div>
          
          {/* Nearby Stores List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Najbliższe sklepy
              </h4>
              
              <div className="space-y-3">
                {nearbyStores.slice(0, 6).map((store, index) => (
                  <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${store.is_open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h5 className="font-medium text-gray-900">{store.name}</h5>
                          <p className="text-sm text-gray-600">{store.distance}km • {store.walking_time} min pieszo</p>
                          <p className="text-xs text-gray-500 capitalize">{store.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${store.is_open ? 'text-green-600' : 'text-red-600'}`}>
                        {store.is_open ? 'Otwarte' : 'Zamknięte'}
                      </div>
                      <Link href={`/stores/${store.id}`} className="text-blue-600 hover:text-blue-700 text-sm">
                        Zobacz produkty →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  🗺️ Otwórz pełną mapę
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-900">{t.bestOffers}</h3>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {t.activePromotions}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.slice(0, 6).map((product) => {
            const bestStore = getBestStore(product.prices);
            const bestPrice = getBestPrice(product.prices);
            const hasPromotion = product.prices.some(p => p.is_promotion);
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-300 transform hover:scale-105 cursor-pointer">
                <div className="p-6 relative">
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">{product.category_icon}</span>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-gray-600 text-sm group-hover:text-blue-500 transition-colors">{product.description}</p>
                          <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-600 transition-colors">{product.brand}</p>
                        </div>
                      </div>
                      {hasPromotion && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                          PROMOCJA
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {product.prices.slice(0, 3).map((price, index) => (
                        <div 
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
                            price.price === bestPrice 
                              ? 'bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{price.store_name}</span>
                            {price.is_promotion && (
                              <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium animate-bounce">
                                -{price.discount_percentage}%
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-bold transition-all duration-300 ${
                              price.price === bestPrice ? 'text-green-700 text-lg group-hover:text-green-800' : 'text-gray-900'
                            }`}>
                              {formatPrice(price.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                      <div className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors font-medium">
                        Najlepsze: <span className="font-bold text-green-600 group-hover:text-green-700 transition-colors">{bestStore?.store_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToFavorites(product.id)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            favoriteItems.includes(product.id) 
                              ? 'bg-red-100 text-red-600 ring-2 ring-red-300' 
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                          title={t.addToFavorites}
                        >
                          {favoriteItems.includes(product.id) ? '❤️' : '🤍'}
                        </button>
                        <button
                          onClick={() => addToCompare(product)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            compareList.find(p => p.id === product.id)
                              ? 'bg-purple-100 text-purple-600 ring-2 ring-purple-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                          title={t.addToCompare}
                        >
                          ⚖️
                        </button>
                        <button
                          onClick={() => addPriceTracking(product.id, bestPrice * 0.9)}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all hover:scale-110 font-bold"
                          title={t.trackPrice}
                        >
                          🔔
                        </button>
                        <button
                          onClick={() => {
                            const store = stores.find(s => s.name === bestStore?.store_name);
                            if (store) addToCart(product.id, store.id);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-all hover:shadow-lg transform hover:scale-105"
                        >
                          🛒 {t.addToCart}
                        </button>
                        <Link
                          href={`/products/${product.id}`}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-all hover:shadow-lg transform hover:scale-105 hover:shadow-blue-200"
                        >
                          {t.viewProduct}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Comparison Panel */}
      {compareList.length > 0 && (
        <section className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">{t.compareProducts}</h3>
            <button 
              onClick={() => setCompareList([])}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {compareList.map((product) => {
              const bestPrice = getBestPrice(product.prices);
              return (
                <div key={product.id} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-sm">{product.name}</h5>
                      <p className="text-xs text-gray-600 font-medium">{product.brand}</p>
                      <p className="text-sm font-bold text-green-600">{formatPrice(bestPrice)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {compareList.length >= 2 && (
            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              📊 {t.detailedComparison}
            </button>
          )}
        </section>
      )}

      {/* Shopping Cart Panel */}
      {cart.length > 0 && (
        <section className={`fixed bottom-4 left-4 rounded-2xl shadow-2xl border p-6 z-50 max-w-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">🛒 {language === 'pl' ? 'Koszyk' : 'Shopping Cart'}</h3>
            <button 
              onClick={() => setCart([])}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-bold text-sm">{item.product.name}</h5>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.store.name}</p>
                    <p className="text-sm font-bold text-green-600">{formatPrice(item.price)}</p>
                    {item.savings > 0 && (
                      <p className="text-xs text-green-600">💰 Oszczędność: {item.savings.toFixed(2)} zł</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{language === 'pl' ? 'Razem:' : 'Total:'}</span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">{language === 'pl' ? 'Oszczędności:' : 'Savings:'}</span>
              <span className="text-sm font-bold text-green-600">
                {formatPrice(cart.reduce((sum, item) => sum + (item.savings * item.quantity), 0))}
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              🛒 {language === 'pl' ? 'Przejdź do kasy' : 'Checkout'}
            </button>
            
            {/* Product Recommendations */}
            {getRecommendations().length > 0 && (
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className="font-bold text-sm mb-3">
                  💡 {language === 'pl' ? 'Polecane dla Ciebie:' : 'Recommended for you:'}
                </h4>
                <div className="space-y-2">
                  {getRecommendations().map((product) => {
                    const bestPrice = getBestPrice(product.prices);
                    const bestStore = getBestStore(product.prices);
                    return (
                      <div key={product.id} className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-bold">{product.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{bestStore?.store_name}</p>
                            <p className="text-xs font-bold text-green-600">{formatPrice(bestPrice)}</p>
                          </div>
                          <button
                            onClick={() => {
                              const store = stores.find(s => s.name === bestStore?.store_name);
                              if (store) addToCart(product.id, store.id);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stores Network */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            Porównujemy ceny w największych sieciach Polski
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:scale-105 cursor-pointer">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">{store.logo}</div>
                  <div className="text-white font-bold text-lg mb-1 group-hover:text-blue-100 transition-colors">{store.name}</div>
                  <div className="text-blue-100 text-sm group-hover:text-white transition-colors">{store.location_count}+ lokalizacji</div>
                  <div className="text-blue-200 text-xs mt-1 capitalize group-hover:text-blue-100 transition-colors">{store.type.replace('_', ' ')}</div>
                </div>

                {/* Hover Store Info */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{store.logo}</span>
                      <div>
                        <h4 className="font-bold text-gray-900">{store.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{store.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{store.location_count.toLocaleString()}+</div>
                        <div className="text-xs text-gray-500">Lokalizacje</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{store.categories.length}</div>
                        <div className="text-xs text-gray-500">Kategorie</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Dostępne kategorie:</p>
                      <div className="flex flex-wrap gap-1">
                        {store.categories.slice(0, 6).map((category, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                            {category}
                          </span>
                        ))}
                        {store.categories.length > 6 && (
                          <span className="text-gray-500 text-xs px-2 py-1">+{store.categories.length - 6}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/stores/${store.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        Produkty
                      </Link>
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                      >
                        🌐
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.aiFeatures}</h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            {t.aiDescription}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-4xl mb-4">🧠</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Inteligentne rekomendacje</h4>
            <p className="text-gray-700 font-medium mb-4">
              AI analizuje Twoje preferencje i sugeruje najlepsze produkty w najkorzystniejszych cenach.
            </p>
            <button 
              onClick={() => window.location.href = '/smart-shopping'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            >
              🎯 Sprawdź rekomendacje
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Optymalizacja budżetu</h4>
            <p className="text-gray-700 font-medium mb-4">
              Automatyczne planowanie listy zakupów z maksymalizacją oszczędności.
            </p>
            <button 
              onClick={() => alert('💰 Funkcja oszczędzania: Średnio 15-25% oszczędności dzięki AI!')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            >
              💸 Sprawdź oszczędności
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Analiza trendów</h4>
            <p className="text-gray-700 font-medium mb-4">
              Śledzenie zmian cen i przewidywanie najlepszych momentów na zakupy.
            </p>
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3535/api/products/trending');
                  const data = await response.json();
                  alert(`📈 Trendy: ${data.data.length} produktów w promocji! Sprawdź sekcję "Najlepsze oferty".`);
                } catch (error) {
                  alert('📊 Analiza trendów: Aktualizacja co 15 minut!');
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            >
              📈 Zobacz trendy
            </button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              const favorites = document.querySelectorAll('[title="Dodaj do ulubionych"]');
              if (favorites.length > 0) {
                (favorites[0] as HTMLElement).click();
              } else {
                alert('❤️ Kliknij serce przy dowolnym produkcie, aby dodać do ulubionych!');
              }
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all font-bold"
          >
            ❤️ Demo: Dodaj do ulubionych
          </button>
          <button 
            onClick={() => {
              const compareBtn = document.querySelectorAll('[title="Dodaj do porównania"]');
              if (compareBtn.length > 0) {
                (compareBtn[0] as HTMLElement).click();
              } else {
                alert('⚖️ Kliknij wagę przy dowolnym produkcie, aby porównać ceny!');
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl hover:shadow-lg transition-all font-bold"
          >
            ⚖️ Demo: Porównaj produkty
          </button>
          <button 
            onClick={() => {
              const alertBtn = document.querySelectorAll('[title="Śledź cenę"]');
              if (alertBtn.length > 0) {
                (alertBtn[0] as HTMLElement).click();
              } else {
                alert('🔔 Kliknij dzwonek przy dowolnym produkcie, aby śledzić cenę!');
              }
            }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl hover:shadow-lg transition-all font-bold"
          >
            🔔 Demo: Śledź ceny
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 rounded-xl hover:shadow-lg transition-all font-bold"
          >
            🔄 Odśwież dane
          </button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Zacznij oszczędzać już dziś!
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Dołącz do tysięcy Polaków, którzy oszczędzają na zakupach dzięki GroceryCompare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-lg"
            >
              🛒 Przeglądaj produkty
            </Link>
            <Link
              href="/ai"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-lg"
            >
              🤖 Wypróbuj AI Asystenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">🛒 GroceryCompare</h4>
              <p className="text-gray-400">
                Inteligentna platforma porównywania cen produktów spożywczych w Polsce.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Produkty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white">Wszystkie produkty</Link></li>
                <li><Link href="/categories" className="hover:text-white">Kategorie</Link></li>
                <li><Link href="/products/trending" className="hover:text-white">Promocje</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Sklepy</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/stores" className="hover:text-white">Wszystkie sklepy</Link></li>
                <li><Link href="/stores?type=discount" className="hover:text-white">Dyskonty</Link></li>
                <li><Link href="/stores?type=hypermarket" className="hover:text-white">Hipermarkety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">AI & Pomocy</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ai" className="hover:text-white">AI Asystent</Link></li>
                <li><Link href="/help" className="hover:text-white">Pomoc</Link></li>
                <li><Link href="/contact" className="hover:text-white">Kontakt</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 GroceryCompare Poland. Wszystkie prawa zastrzeżone.</p>
            <p className="mt-2 text-sm">Aktualizacja cen: co 15 minut | Dane z 9 sieci handlowych</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
