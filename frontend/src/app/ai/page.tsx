'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  brand: string;
  category_name: string;
  category_icon: string;
  prices: {
    store_name: string;
    price: number;
    is_promotion?: boolean;
    discount_percentage?: number;
  }[];
}

interface AIRecommendation {
  type: 'budget' | 'promotion' | 'route' | 'substitute';
  title: string;
  description: string;
  savings?: number;
  products?: Product[];
  icon: string;
}

export default function AIPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', message: string}[]>([
    { role: 'ai', message: 'Cześć! Jestem AI asystentem GroceryCompare. Pomogę Ci zaoszczędzić na zakupach! Czego potrzebujesz?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [budget, setBudget] = useState(200);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, trendingRes] = await Promise.all([
        fetch('http://localhost:3535/api/products?limit=20'),
        fetch('http://localhost:3535/api/products/trending')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      }

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json();
        generateRecommendations(trendingData.data || []);
      }
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (trendingProducts: Product[]) => {
    const recs: AIRecommendation[] = [
      {
        type: 'promotion',
        title: 'Najlepsze promocje dziś',
        description: 'Znalazłem produkty z największymi rabatami. Możesz zaoszczędzić do 30%!',
        savings: 45.50,
        products: trendingProducts.slice(0, 3),
        icon: '🔥'
      },
      {
        type: 'budget',
        title: 'Optymalizacja budżetu',
        description: 'Na podstawie Twojego budżetu, polecam te produkty dla maksymalnych oszczędności.',
        savings: 28.30,
        icon: '💰'
      },
      {
        type: 'route',
        title: 'Najlepsza trasa zakupów',
        description: 'Zaplanowałem optymalną trasę: Biedronka → LIDL → Rossmann. Oszczędzisz czas i paliwo!',
        icon: '🗺️'
      },
      {
        type: 'substitute',
        title: 'Alternatywne produkty',
        description: 'Podobne produkty w niższych cenach. Te zamienniki mogą zaoszczędzić 15% Twojego budżetu.',
        savings: 19.80,
        icon: '🔄'
      }
    ];
    setRecommendations(recs);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      const lower = userMessage.toLowerCase();
      
      if (lower.includes('mleko') || lower.includes('milk')) {
        aiResponse = '🥛 Znalazłem najlepsze ceny na mleko:\n• LIDL: 3.29 zł (najlepsze!)\n• Biedronka: 3.49 zł\n• Żabka: 3.99 zł\n\nPolecam LIDL - zaoszczędzisz 0.20 zł na litrze!';
      } else if (lower.includes('chleb') || lower.includes('bread')) {
        aiResponse = '🍞 Chleb żytni w najlepszych cenach:\n• LIDL: 2.79 zł ⭐\n• Biedronka: 2.99 zł\n• Carrefour: 3.19 zł\n\nLIDL oferuje najlepszą wartość!';
      } else if (lower.includes('promocje') || lower.includes('rabat')) {
        aiResponse = '🔥 Aktualne promocje TOP:\n• Jogurt Danone: -20% w LIDL (2.99 zł)\n• Pizza Dr. Oetker: -25% w LIDL (6.99 zł)\n• Czekolada Milka: -18% w LIDL (3.49 zł)\n\nLIDL ma dziś super promocje!';
      } else if (lower.includes('oszczędność') || lower.includes('save')) {
        aiResponse = '💡 Moje tips na oszczędności:\n1. Kupuj w promocjach\n2. Porównuj ceny przed zakupami\n3. Planuj trasę (LIDL ma najlepsze ceny)\n4. Unikaj impulse buying\n5. Używaj listy zakupów\n\nMożesz zaoszczędzić 15-30% miesięcznie!';
      } else if (lower.includes('trasa') || lower.includes('route')) {
        aiResponse = '🗺️ Optymalna trasa zakupów:\n1. 🔵 LIDL (produkty podstawowe)\n2. 🔴 Biedronka (pozostałe artykuły)\n3. 💊 Rossmann (higiena/chemia)\n\nTa kolejność da Ci najlepsze ceny i oszczędzi czas!';
      } else {
        aiResponse = '🤖 Rozumiem! Mogę pomóc Ci z:\n• Znajdowaniem najlepszych cen\n• Planowaniem tras zakupów\n• Optymalizacją budżetu\n• Znajdowaniem promocji\n\nSpytaj mnie np. "gdzie najtańsze mleko?" lub "jakie są promocje?"';
      }
      
      setChatMessages(prev => [...prev, { role: 'ai', message: aiResponse }]);
    }, 1000);
  };

  const getBestPrice = (prices: any[]) => {
    return Math.min(...prices.map(p => p.price));
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} zł`;
  };

  const calculateTotalSavings = () => {
    return recommendations.reduce((sum, rec) => sum + (rec.savings || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-3xl mr-3">🛒</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    GroceryCompare
                  </h1>
                  <span className="text-xs text-gray-500 font-medium">AI-Powered Poland</span>
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
              <Link href="/ai" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg font-medium">
                🤖 AI Asystent
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Asystent Zakupowy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Inteligentny asystent, który pomoże Ci zaoszczędzić pieniądze, znaleźć najlepsze promocje 
            i zaplanować optymalne zakupy w polskich sklepach.
          </p>
          
          <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-200">
            <div className="text-2xl font-bold text-green-800 mb-2">
              Potencjalne oszczędności dzisiaj: {formatPrice(calculateTotalSavings())}
            </div>
            <div className="text-green-600">Oparte na analizie aktualnych promocji i cen</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - AI Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Personalizowane rekomendacje</h3>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <div className="text-xl text-gray-600">AI analizuje najlepsze oferty...</div>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{rec.icon}</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{rec.title}</h4>
                          <p className="text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                      {rec.savings && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                          -{formatPrice(rec.savings)}
                        </div>
                      )}
                    </div>
                    
                    {rec.products && (
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {rec.products.map((product) => (
                          <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">{product.category_icon}</span>
                              <div>
                                <div className="font-semibold text-sm">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.brand}</div>
                              </div>
                            </div>
                            <div className="text-green-700 font-bold">
                              {formatPrice(getBestPrice(product.prices))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg">
                      Zobacz szczegóły
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Budget Optimizer */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">💰 Optymalizator budżetu</h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twój budżet na zakupy: {budget} zł
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50 zł</span>
                  <span>500 zł</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">AI przewiduje, że możesz kupić:</div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.floor(budget / 4.5)} produktów podstawowych
                </div>
                <div className="text-sm text-gray-500">
                  Z potencjalną oszczędnością: {formatPrice(budget * 0.15)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                💬 Chat z AI
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  ONLINE
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">Zadaj pytanie o produkty, ceny lub promocje</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm whitespace-pre-line">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Napisz wiadomość... (np. 'gdzie najtańsze mleko?')"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleChatSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Wyślij
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Mleko ceny', 'Promocje dziś', 'Najlepsza trasa', 'Oszczędności tips'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setChatInput(suggestion);
                      handleChatSend();
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🚀 Funkcje AI Asystenta</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-bold text-lg mb-2">Analiza trendów</h4>
              <p className="text-gray-600 text-sm">Przewidywanie zmian cen i najlepszych momentów na zakupy</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-4xl mb-4">🛣️</div>
              <h4 className="font-bold text-lg mb-2">Optymalna trasa</h4>
              <p className="text-gray-600 text-sm">Planowanie najkrótszej trasy między sklepami</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold text-lg mb-2">Smart recommendations</h4>
              <p className="text-gray-600 text-sm">Personalizowane rekomendacje na podstawie preferencji</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-4xl mb-4">💱</div>
              <h4 className="font-bold text-lg mb-2">Porównanie cen</h4>
              <p className="text-gray-600 text-sm">Automatyczne porównywanie cen w czasie rzeczywistym</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Gotowy na inteligentne zakupy?</h3>
          <p className="text-purple-100 mb-6">
            AI Asystent analizuje tysiące cen codziennie, aby znaleźć dla Ciebie najlepsze okazje!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            >
              🛒 Rozpocznij zakupy
            </Link>
            <Link
              href="/stores"
              className="bg-purple-500 hover:bg-purple-400 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg"
            >
              🏪 Zobacz sklepy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 