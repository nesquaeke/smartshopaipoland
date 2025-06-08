'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand: string;
  category_icon: string;
  category_name: string;
  prices: {
    store_name: string;
    price: number;
    is_promotion?: boolean;
    discount_percentage?: number;
  }[];
}

interface AIRecommendation {
  id: number;
  type: 'budget_optimization' | 'health_suggestion' | 'bulk_discount' | 'seasonal_offer' | 'smart_substitute';
  title: string;
  description: string;
  product?: Product;
  savings: number;
  confidence: number;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetAnalysis {
  weekly_budget: number;
  current_spending: number;
  remaining_budget: number;
  predicted_overspend: number;
  savings_suggestions: number;
  category_breakdown: {
    [category: string]: {
      spent: number;
      budget: number;
      percentage: number;
    };
  };
}

interface RouteOptimization {
  total_distance: string;
  total_time: string;
  fuel_cost: number;
  carbon_footprint: string;
  stores: {
    name: string;
    address: string;
    order: number;
    items: string[];
    estimated_time: string;
    distance_from_previous: string;
  }[];
}

interface SmartInsight {
  type: 'price_trend' | 'seasonal_alert' | 'stock_warning' | 'promotion_prediction';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  action_required: boolean;
}

export default function SmartShopping() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null);
  const [routeOptimization, setRouteOptimization] = useState<RouteOptimization | null>(null);
  const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // User preferences
  const [weeklyBudget, setWeeklyBudget] = useState(300);
  const [dietType, setDietType] = useState('normal');
  const [maxDistance, setMaxDistance] = useState(5);
  const [preferredStores, setPreferredStores] = useState<string[]>(['Biedronka', 'LIDL']);
  const [sustainabilityMode, setSustainabilityMode] = useState(false);
  
  // AI Learning states
  const [aiLearningData, setAiLearningData] = useState({
    purchase_history: [],
    preference_patterns: {},
    seasonal_trends: {},
    price_sensitivity: 'medium'
  });

  const texts = {
    pl: {
      title: "Smart Shopping AI",
      subtitle: "Inteligentny asystent zakupowy napędzany sztuczną inteligencją",
      cartAnalysis: "Analiza Twojego sepetu",
      aiRecommendations: "Rekomendacje AI",
      budgetManager: "Menedżer budżetu",
      routeOptimizer: "Optymalizator trasy",
      smartInsights: "Inteligentne spostrzeżenia",
      preferences: "Preferencje",
      weeklyBudget: "Budżet tygodniowy",
      dietType: "Typ diety",
      maxDistance: "Maksymalna odległość",
      sustainabilityMode: "Tryb ekologiczny",
      normal: "Normalna",
      vegetarian: "Wegetariańska",
      vegan: "Wegańska",
      keto: "Ketogeniczna",
      startAnalysis: "Rozpocznij analizę AI",
      analyzingCart: "Analizuję zawartość sepetu...",
      optimizingBudget: "Optymalizuję budżet...",
      planningRoute: "Planuję optymalną trasę...",
      generateInsights: "Generuję inteligentne spostrzeżenia...",
      acceptRecommendation: "Zaakceptuj",
      declineRecommendation: "Odrzuć",
      confidence: "Pewność",
      potentialSavings: "Potencjalne oszczędności",
      currentSpending: "Obecne wydatki",
      remainingBudget: "Pozostały budżet",
      predictedOverspend: "Przewidywane przekroczenie",
      categoryBreakdown: "Podział na kategorie",
      totalDistance: "Łączna odległość",
      totalTime: "Łączny czas",
      fuelCost: "Koszt paliwa",
      carbonFootprint: "Ślad węglowy",
      empty: "Sepet jest pusty",
      emptyDesc: "Dodaj produkty do sepetu, aby uruchomić AI",
      addProducts: "Dodaj produkty"
    },
    en: {
      title: "Smart Shopping AI",
      subtitle: "Intelligent shopping assistant powered by artificial intelligence",
      cartAnalysis: "Your Cart Analysis",
      aiRecommendations: "AI Recommendations",
      budgetManager: "Budget Manager",
      routeOptimizer: "Route Optimizer",
      smartInsights: "Smart Insights",
      preferences: "Preferences",
      weeklyBudget: "Weekly Budget",
      dietType: "Diet Type",
      maxDistance: "Max Distance",
      sustainabilityMode: "Sustainability Mode",
      normal: "Normal",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      keto: "Ketogenic",
      startAnalysis: "Start AI Analysis",
      analyzingCart: "Analyzing cart contents...",
      optimizingBudget: "Optimizing budget...",
      planningRoute: "Planning optimal route...",
      generateInsights: "Generating smart insights...",
      acceptRecommendation: "Accept",
      declineRecommendation: "Decline",
      confidence: "Confidence",
      potentialSavings: "Potential Savings",
      currentSpending: "Current Spending",
      remainingBudget: "Remaining Budget",
      predictedOverspend: "Predicted Overspend",
      categoryBreakdown: "Category Breakdown",
      totalDistance: "Total Distance",
      totalTime: "Total Time",
      fuelCost: "Fuel Cost",
      carbonFootprint: "Carbon Footprint",
      empty: "Cart is empty",
      emptyDesc: "Add products to cart to activate AI",
      addProducts: "Add Products"
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadCartData();
    loadUserPreferences();
  }, []);

  const loadCartData = () => {
    const savedCart = localStorage.getItem('smartshop_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const loadUserPreferences = () => {
    const savedPrefs = localStorage.getItem('smartshop_preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setWeeklyBudget(prefs.weeklyBudget || 300);
      setDietType(prefs.dietType || 'normal');
      setMaxDistance(prefs.maxDistance || 5);
      setPreferredStores(prefs.preferredStores || ['Biedronka', 'LIDL']);
      setSustainabilityMode(prefs.sustainabilityMode || false);
    }
  };

  const saveUserPreferences = () => {
    const prefs = {
      weeklyBudget,
      dietType,
      maxDistance,
      preferredStores,
      sustainabilityMode
    };
    localStorage.setItem('smartshop_preferences', JSON.stringify(prefs));
  };

  const runAIAnalysis = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI analysis steps
      await analyzeCart();
      await optimizeBudget();
      await planOptimalRoute();
      await generateSmartInsights();
      
      saveUserPreferences();
    } catch (error) {
      console.error('AI Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCart = async () => {
    // Simulate cart analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 1,
        type: 'budget_optimization',
        title: 'Zamień na tańszą alternatywę',
        description: 'Mleko UHT w LIDL jest o 23% tańsze niż w Twojej obecnej lokalizacji',
        savings: 2.40,
        confidence: 94,
        action: 'replace_item',
        priority: 'high'
      },
      {
        id: 2,
        type: 'bulk_discount',
        title: 'Skorzystaj z promocji hurtowej',
        description: 'Kup 3 jogurty zamiast 1 - promocja 3 za 2 w Biedronce',
        savings: 3.50,
        confidence: 100,
        action: 'bulk_purchase',
        priority: 'high'
      },
      {
        id: 3,
        type: 'health_suggestion',
        title: 'Zdrowsza alternatywa',
        description: 'Chleb pełnoziarnisty ma więcej błonnika i jest w tej samej cenie',
        savings: 0,
        confidence: 87,
        action: 'healthier_choice',
        priority: 'medium'
      },
      {
        id: 4,
        type: 'seasonal_offer',
        title: 'Sezonowa promocja',
        description: 'Jabłka polskie są teraz 40% tańsze - sezon jesiennych zbiorów',
        savings: 1.80,
        confidence: 92,
        action: 'seasonal_discount',
        priority: 'medium'
      },
      {
        id: 5,
        type: 'smart_substitute',
        title: 'Inteligentna zamiana',
        description: 'Margaryna zamiast masła - te same wartości odżywcze, 50% taniej',
        savings: 4.20,
        confidence: 78,
        action: 'substitute',
        priority: 'low'
      }
    ];

    setAiRecommendations(mockRecommendations);
  };

  const optimizeBudget = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentSpending = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const mockBudgetAnalysis: BudgetAnalysis = {
      weekly_budget: weeklyBudget,
      current_spending: currentSpending,
      remaining_budget: weeklyBudget - currentSpending,
      predicted_overspend: Math.max(0, currentSpending - weeklyBudget),
      savings_suggestions: 15.60,
      category_breakdown: {
        'Owoce i warzywa': { spent: 45.20, budget: 80, percentage: 56.5 },
        'Nabiał': { spent: 23.40, budget: 50, percentage: 46.8 },
        'Mięso': { spent: 67.80, budget: 100, percentage: 67.8 },
        'Pieczywo': { spent: 12.30, budget: 30, percentage: 41.0 },
        'Napoje': { spent: 18.90, budget: 40, percentage: 47.3 }
      }
    };

    setBudgetAnalysis(mockBudgetAnalysis);
  };

  const planOptimalRoute = async () => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockRouteOptimization: RouteOptimization = {
      total_distance: "4.2 km",
      total_time: "32 min",
      fuel_cost: 8.40,
      carbon_footprint: "1.2 kg CO2",
      stores: [
        {
          name: "Biedronka",
          address: "ul. Marszałkowska 15, Warszawa",
          order: 1,
          items: ["Mleko", "Chleb", "Jabłka"],
          estimated_time: "8 min",
          distance_from_previous: "0 km"
        },
        {
          name: "LIDL", 
          address: "ul. Nowy Świat 42, Warszawa",
          order: 2,
          items: ["Jogurt", "Mięso mielone"],
          estimated_time: "12 min",
          distance_from_previous: "1.8 km"
        },
        {
          name: "Żabka",
          address: "ul. Krakowskie Przedmieście 8, Warszawa", 
          order: 3,
          items: ["Woda", "Przekąski"],
          estimated_time: "5 min",
          distance_from_previous: "2.4 km"
        }
      ]
    };

    setRouteOptimization(mockRouteOptimization);
  };

  const generateSmartInsights = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockInsights: SmartInsight[] = [
      {
        type: 'price_trend',
        title: 'Trend cenowy - mleko',
        description: 'Ceny mleka spadają o 5% w tym tygodniu. Dobry moment na zakup.',
        impact: 'positive',
        confidence: 89,
        action_required: false
      },
      {
        type: 'seasonal_alert',
        title: 'Alert sezonowy',
        description: 'Ziemniaki będą droższe za 2 tygodnie. Rozważ zakup większej ilości.',
        impact: 'negative',
        confidence: 76,
        action_required: true
      },
      {
        type: 'promotion_prediction',
        title: 'Przewidywanie promocji',
        description: 'W przyszłym tygodniu prawdopodobnie będzie promocja na produkty z kategorii nabiał.',
        impact: 'positive',
        confidence: 82,
        action_required: false
      },
      {
        type: 'stock_warning',
        title: 'Ostrzeżenie o zapasach',
        description: 'Ulubiona marka chleba może być niedostępna w weekendy.',
        impact: 'neutral',
        confidence: 71,
        action_required: true
      }
    ];

    setSmartInsights(mockInsights);
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} zł`;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-3xl mr-3">🤖</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                  <span className="text-xs text-gray-500 font-medium">AI Shopping Assistant</span>
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
              <Link href="/sepet" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sepet
              </Link>
              <span className="text-blue-600 font-bold border-b-2 border-blue-600">
                Smart Shopping
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          
          {/* AI Status Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <span className="animate-pulse">🟢</span> AI Ready - {cartItems.length} produktów w analizie
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.empty}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{t.emptyDesc}</p>
            <Link 
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              🛍️ {t.addProducts}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* User Preferences */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">⚙️</span>
                  {t.preferences}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.weeklyBudget}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={weeklyBudget}
                        onChange={(e) => setWeeklyBudget(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">PLN</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.dietType}
                    </label>
                    <select
                      value={dietType}
                      onChange={(e) => setDietType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">{t.normal}</option>
                      <option value="vegetarian">{t.vegetarian}</option>
                      <option value="vegan">{t.vegan}</option>
                      <option value="keto">{t.keto}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.maxDistance} (km)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">{maxDistance} km</div>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sustainabilityMode}
                        onChange={(e) => setSustainabilityMode(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        🌱 {t.sustainabilityMode}
                      </span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={runAIAnalysis}
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⚙️</span>
                      {t.analyzingCart}
                    </span>
                  ) : (
                    <>🚀 {t.startAnalysis}</>
                  )}
                </button>
              </div>

              {/* AI Recommendations */}
              {aiRecommendations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">🤖</span>
                    {t.aiRecommendations}
                  </h3>
                  
                  <div className="space-y-4">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(rec.priority)}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {t.confidence}: {rec.confidence}%
                              </span>
                              {rec.savings > 0 && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  💰 {formatPrice(rec.savings)}
                                </span>
                              )}
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                {rec.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700">
                              ✓ {t.acceptRecommendation}
                            </button>
                            <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-700">
                              ✗ {t.declineRecommendation}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Insights */}
              {smartInsights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">💡</span>
                    {t.smartInsights}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {smartInsights.map((insight, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${getImpactColor(insight.impact)}`}>
                        <h4 className="font-bold mb-2">{insight.title}</h4>
                        <p className="text-sm mb-3">{insight.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-white rounded-full">
                            📊 {insight.confidence}%
                          </span>
                          {insight.action_required && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                              ⚠️ Działanie wymagane
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Analysis */}
              {budgetAnalysis && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💰</span>
                    {t.budgetManager}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(budgetAnalysis.remaining_budget)}
                      </div>
                      <div className="text-sm text-gray-600">{t.remainingBudget}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t.currentSpending}</span>
                        <span className="font-bold">{formatPrice(budgetAnalysis.current_spending)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t.potentialSavings}</span>
                        <span className="font-bold text-green-600">-{formatPrice(budgetAnalysis.savings_suggestions)}</span>
                      </div>
                    </div>
                    
                    {budgetAnalysis.predicted_overspend > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-red-800 font-bold text-sm">
                          ⚠️ {t.predictedOverspend}: {formatPrice(budgetAnalysis.predicted_overspend)}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-bold text-sm mb-2">{t.categoryBreakdown}</h4>
                      <div className="space-y-1">
                        {Object.entries(budgetAnalysis.category_breakdown).map(([category, data]) => (
                          <div key={category}>
                            <div className="flex justify-between text-xs">
                              <span>{category}</span>
                              <span>{data.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${data.percentage > 80 ? 'bg-red-500' : data.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(data.percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Optimization */}
              {routeOptimization && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🗺️</span>
                    {t.routeOptimizer}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="font-bold text-blue-600">{routeOptimization.total_distance}</div>
                        <div className="text-sm text-gray-600">{t.totalDistance}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="font-bold text-green-600">{routeOptimization.total_time}</div>
                        <div className="text-sm text-gray-600">{t.totalTime}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <div className="font-bold text-yellow-600">{formatPrice(routeOptimization.fuel_cost)}</div>
                        <div className="text-sm text-gray-600">{t.fuelCost}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="font-bold text-purple-600">{routeOptimization.carbon_footprint}</div>
                        <div className="text-sm text-gray-600">{t.carbonFootprint}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm">Optymalna trasa:</h4>
                      {routeOptimization.stores.map((store, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                            {store.order}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{store.name}</div>
                            <div className="text-xs text-gray-600">{store.items.length} produktów • {store.estimated_time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                      🚗 Rozpocznij zakupy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 