'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  website: string;
  categories: string[];
  location_count: number;
  logo: string;
  products?: Product[];
}

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');

  // Multilingual texts
  const texts = {
    pl: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      storeDetails: "Szczegóły sklepu",
      products: "Produkty",
      locations: "lokalizacji",
      website: "Strona internetowa",
      categories: "Kategorie",
      bestPrice: "Najlepsza cena",
      addToCart: "Dodaj",
      addToFavorites: "Dodaj do ulubionych",
      promotion: "PROMOCJA",
      storeNotFound: "Sklep nie został znaleziony",
      noProducts: "Brak produktów",
      backToStores: "← Powrót do sklepów"
    },
    en: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      storeDetails: "Store Details",
      products: "Products",
      locations: "locations",
      website: "Website",
      categories: "Categories",
      bestPrice: "Best Price",
      addToCart: "Add",
      addToFavorites: "Add to Favorites",
      promotion: "PROMOTION",
      storeNotFound: "Store not found",
      noProducts: "No products",
      backToStores: "← Back to stores"
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
      fetchStoreProducts();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`http://localhost:3535/api/stores/${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setStore(data.data);
      } else {
        console.error('Store not found');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3535/api/products?store=${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching store products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBestPrice = (prices: any[]) => {
    return Math.min(...prices.map(p => p.price));
  };

  const getStorePrice = (prices: any[], storeName: string) => {
    const storePrice = prices.find(p => p.store_name === storeName);
    return storePrice ? storePrice.price : null;
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} zł`;
  };

  const addToCart = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || !store) return;

    const storePrice = getStorePrice(product.prices, store.name);
    if (!storePrice) return;

    const bestPrice = getBestPrice(product.prices);
    const savings = storePrice - bestPrice;

    setCart(prev => [...prev, {
      productId,
      storeId: store.id,
      product,
      store,
      price: storePrice,
      quantity: 1,
      savings: Math.max(0, savings)
    }]);

    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
    toastDiv.innerHTML = `✅ ${product.name} dodany do koszyka!`;
    document.body.appendChild(toastDiv);
    setTimeout(() => document.body.removeChild(toastDiv), 3000);
  };

  const addToFavorites = (productId: number) => {
    setFavoriteItems(prev => [...prev, productId]);
    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
    toastDiv.innerHTML = '❤️ Dodano do ulubionych!';
    document.body.appendChild(toastDiv);
    setTimeout(() => document.body.removeChild(toastDiv), 3000);
  };

  if (!store && !isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.storeNotFound}
          </h2>
          <Link
            href="/stores"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
          >
            {t.backToStores}
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.siteName}
                </h1>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r ${isDarkMode ? 'from-gray-700 to-gray-600' : 'from-gray-100 to-gray-200'} px-2 py-1 rounded-full`}>{t.motto}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/stores" className="hover:text-blue-600">Mağazalar</Link>
            <span>/</span>
            <span className="text-blue-600">{store?.name || 'Yükleniyor...'}</span>
          </div>
        </div>

        {/* Store Header */}
        {store && (
          <div className={`rounded-3xl shadow-xl p-8 mb-8 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-8xl mr-6">{store.logo || '🏪'}</span>
                <div>
                  <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {store.name}
                  </h1>
                  <p className={`text-lg mb-2 capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {store.type?.replace('_', ' ')} • {store.location_count?.toLocaleString()}+ {t.locations}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {products.length} {t.products}
                    </span>
                    {store.categories && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
                      }`}>
                        {store.categories.length} {t.categories}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link
                  href="/stores"
                  className={`px-6 py-3 rounded-2xl font-medium transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t.backToStores}
                </Link>
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition-all hover:shadow-lg hover:scale-105"
                >
                  🌐 {t.website}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`rounded-3xl shadow-xl p-8 border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.products} ({products.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
              <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ürünler yükleniyor...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.noProducts}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const bestPrice = getBestPrice(product.prices);
                const storePrice = getStorePrice(product.prices, store?.name || '');
                const isCurrentStoreBest = storePrice === bestPrice;
                const hasPromotion = product.prices.some(p => p.is_promotion && p.store_name === store?.name);
                
                return (
                  <div key={product.id} className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border hover:scale-105 transform cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 hover:border-emerald-500' 
                      : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}>
                    <div className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3 group-hover:scale-125 transition-transform duration-300">{product.category_icon}</span>
                          <div>
                            <h4 className={`font-bold text-lg mb-1 group-hover:text-emerald-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {product.name}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.brand}</p>
                          </div>
                        </div>
                        {hasPromotion && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                            🔥 {t.promotion}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
                      
                      {storePrice && (
                        <div className={`p-4 rounded-xl mb-4 ${
                          isCurrentStoreBest 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                            : isDarkMode ? 'bg-gray-600/50' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                              {store?.name}
                            </span>
                            <span className={`font-bold text-lg ${
                              isCurrentStoreBest ? 'text-green-700' : isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {formatPrice(storePrice)}
                            </span>
                          </div>
                          {isCurrentStoreBest && (
                            <div className="text-xs text-green-600 mt-1 font-medium">
                              🏆 {t.bestPrice}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => addToFavorites(product.id)}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${
                            favoriteItems.includes(product.id) 
                              ? 'bg-red-100 text-red-600 ring-2 ring-red-300' 
                              : isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          {favoriteItems.includes(product.id) ? '❤️' : '🤍'}
                        </button>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product.id)}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all hover:shadow-lg transform hover:scale-105"
                          >
                            🛒 {t.addToCart}
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-all hover:shadow-lg transform hover:scale-105"
                          >
                            🔍 Detay
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Panel */}
      {cart.length > 0 && (
        <section className={`fixed bottom-4 left-4 rounded-3xl shadow-2xl border p-6 z-50 max-w-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">🛒 Sepet</h3>
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
                    <p className="text-sm font-bold text-emerald-600">{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Toplam:</span>
              <span className="font-bold text-lg text-emerald-600">
                {formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              🛒 Sepete Git
            </button>
          </div>
        </section>
      )}
    </div>
  );
} 