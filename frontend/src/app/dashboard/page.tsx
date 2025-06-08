'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserStats {
  total_purchases: number;
  total_spent: number;
  total_savings: number;
  favorite_products_count: number;
  active_price_alerts: number;
  member_since: string;
}

interface PriceAlert {
  id: number;
  product_name: string;
  target_price: number;
  current_price: number;
  active: boolean;
  created_at: string;
}

interface ShoppingHistory {
  id: number;
  date: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price_paid: number;
  }>;
  total_amount: number;
  savings_achieved: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistory[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('pl');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedLanguage = localStorage.getItem('language') || 'pl';
    const savedTheme = localStorage.getItem('theme') || 'light';
    setLanguage(savedLanguage);
    setIsDarkMode(savedTheme === 'dark');

    // Simulate loading user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Mock user data - in real app, fetch from API
      const mockUser = {
        id: 1,
        name: 'Jan Kowalski',
        email: 'jan.kowalski@example.com',
        preferences: {
          language: 'pl',
          theme: 'light',
          notifications: {
            email: true,
            price_alerts: true
          }
        }
      };

      const mockStats: UserStats = {
        total_purchases: 24,
        total_spent: 1847.50,
        total_savings: 342.80,
        favorite_products_count: 12,
        active_price_alerts: 5,
        member_since: '2024-01-15'
      };

      const mockPriceAlerts: PriceAlert[] = [
        {
          id: 1,
          product_name: 'Mleko UHT 3,2% Łaciate',
          target_price: 3.20,
          current_price: 3.49,
          active: true,
          created_at: '2024-01-20'
        },
        {
          id: 2,
          product_name: 'Chleb żytni',
          target_price: 2.50,
          current_price: 2.99,
          active: true,
          created_at: '2024-01-18'
        }
      ];

      const mockHistory: ShoppingHistory[] = [
        {
          id: 1,
          date: '2024-01-25',
          items: [
            { product_name: 'Mleko UHT', quantity: 2, price_paid: 6.98 },
            { product_name: 'Chleb żytni', quantity: 1, price_paid: 2.99 }
          ],
          total_amount: 9.97,
          savings_achieved: 1.23
        }
      ];

      setUser(mockUser);
      setStats(mockStats);
      setPriceAlerts(mockPriceAlerts);
      setShoppingHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    pl: {
      dashboard: 'Panel użytkownika',
      overview: 'Przegląd',
      price_alerts: 'Alerty cenowe',
      shopping_history: 'Historia zakupów',
      settings: 'Ustawienia',
      total_purchases: 'Łączne zakupy',
      total_spent: 'Wydano łącznie',
      total_savings: 'Oszczędności',
      favorite_products: 'Ulubione produkty',
      active_alerts: 'Aktywne alerty',
      member_since: 'Członek od',
      current_price: 'Aktualna cena',
      target_price: 'Cena docelowa',
      product: 'Produkt',
      date: 'Data',
      amount: 'Kwota',
      savings: 'Oszczędności',
      no_alerts: 'Brak aktywnych alertów cenowych',
      no_history: 'Brak historii zakupów',
      welcome: 'Witaj'
    },
    en: {
      dashboard: 'User Dashboard',
      overview: 'Overview',
      price_alerts: 'Price Alerts',
      shopping_history: 'Shopping History',
      settings: 'Settings',
      total_purchases: 'Total Purchases',
      total_spent: 'Total Spent',
      total_savings: 'Total Savings',
      favorite_products: 'Favorite Products',
      active_alerts: 'Active Alerts',
      member_since: 'Member Since',
      current_price: 'Current Price',
      target_price: 'Target Price',
      product: 'Product',
      date: 'Date',
      amount: 'Amount',
      savings: 'Savings',
      no_alerts: 'No active price alerts',
      no_history: 'No shopping history',
      welcome: 'Welcome'
    }
  };

  const t = translations[language as keyof typeof translations];

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">
              {t.welcome}, {user?.name}! 👋
            </h1>
            <Link href="/" className="text-green-600 hover:text-green-700">
              ← Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {['overview', 'price_alerts', 'shopping_history', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t[tab as keyof typeof t]}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.total_purchases}
                    </p>
                    <p className="text-2xl font-bold">{stats.total_purchases}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.total_spent}
                    </p>
                    <p className="text-2xl font-bold">{stats.total_spent.toFixed(2)} zł</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.total_savings}
                    </p>
                    <p className="text-2xl font-bold text-green-600">{stats.total_savings.toFixed(2)} zł</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4">🔔 Najnowsze alerty cenowe</h3>
              {priceAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium">{alert.product_name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t.target_price}: {alert.target_price.toFixed(2)} zł
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{alert.current_price.toFixed(2)} zł</p>
                    <p className={`text-sm ${alert.current_price <= alert.target_price ? 'text-green-600' : 'text-orange-600'}`}>
                      {alert.current_price <= alert.target_price ? '✅ Osiągnięto' : '📈 Powyżej celu'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Alerts Tab */}
        {activeTab === 'price_alerts' && (
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4">🔔 {t.price_alerts}</h3>
            {priceAlerts.length > 0 ? (
              <div className="space-y-4">
                {priceAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{alert.product_name}</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Utworzono: {new Date(alert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{t.target_price}: <span className="font-bold">{alert.target_price.toFixed(2)} zł</span></p>
                        <p className="text-sm">{t.current_price}: <span className="font-bold">{alert.current_price.toFixed(2)} zł</span></p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          alert.current_price <= alert.target_price
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {alert.current_price <= alert.target_price ? 'Osiągnięto' : 'Oczekuje'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.no_alerts}
              </p>
            )}
          </div>
        )}

        {/* Shopping History Tab */}
        {activeTab === 'shopping_history' && (
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4">🛍️ {t.shopping_history}</h3>
            {shoppingHistory.length > 0 ? (
              <div className="space-y-4">
                {shoppingHistory.map(order => (
                  <div key={order.id} className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">Zamówienie #{order.id}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.total_amount.toFixed(2)} zł</p>
                        <p className="text-sm text-green-600">Oszczędności: {order.savings_achieved.toFixed(2)} zł</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>{item.price_paid.toFixed(2)} zł</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.no_history}
              </p>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4">⚙️ {t.settings}</h3>
            <div className="space-y-6">
              {/* Language Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Język / Language</label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    localStorage.setItem('language', e.target.value);
                  }}
                  className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="pl">Polski</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Motyw</label>
                <select
                  value={isDarkMode ? 'dark' : 'light'}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setIsDarkMode(newTheme === 'dark');
                    localStorage.setItem('theme', newTheme);
                  }}
                  className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="light">Jasny</option>
                  <option value="dark">Ciemny</option>
                </select>
              </div>

              {/* Notification Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Powiadomienia</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-3" />
                    <span>Powiadomienia email</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-3" />
                    <span>Alerty cenowe</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span>Promocje i oferty</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 