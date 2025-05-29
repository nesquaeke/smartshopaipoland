'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    average_discount: 0
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3535/api/promotions');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.data || []);
        setStats(data.meta || { total: 0, average_discount: 0 });
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBestPromotionPrice = (prices: any[]) => {
    const promotionPrices = prices.filter(p => p.is_promotion);
    return promotionPrices.length > 0 ? Math.min(...promotionPrices.map(p => p.price)) : null;
  };

  const getPromotionDetails = (prices: any[]) => {
    return prices.find(p => p.is_promotion);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Ładowanie promocji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-3">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  GroceryCompare
                </h1>
                <span className="text-xs text-gray-500 font-medium">Aktualne Promocje</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                ← Powrót do głównej
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔥 Aktualne promocje
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Nie przegap najlepszych ofert z polskich sklepów. Oszczędzaj do {stats.average_discount}% na ulubionych produktach!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="text-3xl font-bold text-red-600">{stats.total}</div>
              <div className="text-gray-600 font-medium">Aktywnych promocji</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="text-3xl font-bold text-orange-600">{stats.average_discount}%</div>
              <div className="text-gray-600 font-medium">Średnia zniżka</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="text-3xl font-bold text-yellow-600">24h</div>
              <div className="text-gray-600 font-medium">Aktualizacja</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-gray-600 font-medium">Sklepów</div>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((product) => {
            const promotion = getPromotionDetails(product.prices);
            const bestPrice = getBestPromotionPrice(product.prices);
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-red-200 hover:border-red-300 transform hover:scale-105">
                <div className="p-6 relative">
                  {/* Promotion Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    -{promotion?.discount_percentage}%
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start mb-4">
                      <span className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">{product.category_icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{product.brand}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border-2 border-red-200">
                        <div>
                          <div className="font-bold text-red-700">{promotion?.store_name}</div>
                          <div className="text-sm text-red-600">Promocja aktywna</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-700">{bestPrice?.toFixed(2)} zł</div>
                          <div className="text-sm text-red-600">Oszczędzasz {promotion?.discount_percentage}%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other prices */}
                    <div className="space-y-2 mb-4">
                      {product.prices.filter(p => !p.is_promotion).slice(0, 2).map((price, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{price.store_name}</span>
                          <span className="font-medium text-gray-900">{price.price.toFixed(2)} zł</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        Ważna: <span className="font-semibold text-red-600">do końca tygodnia</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                        >
                          🔥 Skorzystaj
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {promotions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Brak aktywnych promocji</h3>
            <p className="text-gray-600 mb-8">Aktualnie nie ma dostępnych promocji. Sprawdź ponownie wkrótce!</p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              Przeglądaj wszystkie produkty
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-white text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">🔔 Nie przegap okazji!</h3>
          <p className="text-xl mb-6">
            Zapisz się na powiadomienia o nowych promocjach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/features" className="bg-white text-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all">
              📱 Powiadomienia mobilne
            </Link>
            <Link href="/" className="border-2 border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/10 transition-all">
              🏠 Wróć na główną
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 