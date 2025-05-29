'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState('voice-search');
  const [isRecording, setIsRecording] = useState(false);
  const [budget, setBudget] = useState(200);
  const [familySize, setFamilySize] = useState(4);
  const [selectedList, setSelectedList] = useState('healthy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-3">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GroceryCompare
                </h1>
                <span className="text-xs text-gray-500 font-medium">Demo Features</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ← Powrót do głównej
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Przyszłość zakupów spożywczych
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Poznaj zaawansowane funkcje AI, które wkrótce zrewolucjonizują sposób robienia zakupów w Polsce
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'voice-search', label: '🎤 Arama Sесі', color: 'blue' },
            { id: 'ai-lists', label: '🤖 AI Listy', color: 'purple' },
            { id: 'price-prediction', label: '📈 Przewidywanie cen', color: 'green' },
            { id: 'budget-optimizer', label: '💰 Optymalizator budżetu', color: 'yellow' },
            { id: 'location-features', label: '🗺️ Funkcje lokalizacji', color: 'red' },
            { id: 'mobile-app', label: '📱 Aplikacja mobilna', color: 'indigo' }
          ].map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFeature === feature.id
                  ? `bg-${feature.color}-600 text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          {/* Voice Search Demo */}
          {activeFeature === 'voice-search' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">🎤 Wyszukiwanie głosowe</h3>
                <p className="text-gray-600 mb-8">Powiedz co potrzebujesz, AI znajdzie najlepsze oferty</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl transition-all ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRecording ? '⏹️' : '🎤'}
                    </button>
                    <p className="mt-4 text-lg">
                      {isRecording ? 'Słucham... Powiedz co potrzebujesz' : 'Kliknij aby rozpocząć'}
                    </p>
                  </div>
                  
                  {isRecording && (
                    <div className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                        <span className="text-green-600 font-medium">Rozpoznawanie mowy...</span>
                      </div>
                      <p className="text-gray-700 italic">"Potrzebuję mleka, chleba i sera na weekend..."</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-xl p-4">
                      <h4 className="font-bold text-green-600 mb-2">✅ Rozpoznane produkty:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Mleko pełnotłuste 1L</li>
                        <li>• Chleb żytni 500g</li>
                        <li>• Ser Gouda plastry</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <h4 className="font-bold text-blue-600 mb-2">🏪 Najlepsze sklepy:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Biedronka - 11.27 zł</li>
                        <li>• LIDL - 10.97 zł (promocja)</li>
                        <li>• Netto - 11.45 zł</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Lists Demo */}
          {activeFeature === 'ai-lists' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">🤖 Inteligentne listy zakupów</h3>
                <p className="text-gray-600 mb-8">AI tworzy spersonalizowane listy na podstawie Twoich preferencji</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h4 className="text-xl font-bold mb-4">📝 Kreator listy AI</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Wielkość rodziny:</label>
                        <div className="flex space-x-2">
                          {[1,2,3,4,5,6].map(size => (
                            <button
                              key={size}
                              onClick={() => setFamilySize(size)}
                              className={`w-10 h-10 rounded-full ${
                                familySize === size ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Budżet: {budget} zł</label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Typ listy:</label>
                        <select
                          value={selectedList}
                          onChange={(e) => setSelectedList(e.target.value)}
                          className="w-full p-3 border rounded-xl"
                        >
                          <option value="healthy">🥗 Zdrowa dieta</option>
                          <option value="family">👨‍👩‍👧‍👦 Rodzina z dziećmi</option>
                          <option value="budget">💰 Oszczędna lista</option>
                          <option value="vegetarian">🌱 Wegetariańska</option>
                        </select>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                        🚀 Generuj listę AI
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">📋 Wygenerowana lista</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Mleko migdałowe 1L', price: '6.99 zł', store: 'LIDL', category: 'Nabiał' },
                      { name: 'Awokado 2szt', price: '7.98 zł', store: 'Carrefour', category: 'Owoce' },
                      { name: 'Quinoa 500g', price: '12.99 zł', store: 'Tesco', category: 'Zdrowa żywność' },
                      { name: 'Łosoś filet 300g', price: '18.99 zł', store: 'Biedronka', category: 'Ryby' },
                      { name: 'Brokuły 500g', price: '4.49 zł', store: 'Netto', category: 'Warzywa' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">{item.store} • {item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{item.price}</p>
                        </div>
                      </div>
                    ))}
                    <div className="bg-green-100 rounded-xl p-4 text-center">
                      <p className="font-bold text-green-800">Łączny koszt: {(budget * 0.82).toFixed(2)} zł</p>
                      <p className="text-sm text-green-600">Zostaje ci {(budget * 0.18).toFixed(2)} zł z budżetu!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Prediction Demo */}
          {activeFeature === 'price-prediction' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">📈 Przewidywanie cen AI</h3>
                <p className="text-gray-600 mb-8">Sztuczna inteligencja przewiduje zmiany cen i optymalne momenty zakupu</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">🔮 Analiza trendu cenowego</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Mleko Łaciate 1L</h5>
                        <span className="text-lg font-bold">3.49 zł</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">↓ Spadek o 15% w ciągu 3 dni</span>
                        <span className="text-gray-500">Najlepszy moment: Jutro</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Banany 1kg</h5>
                        <span className="text-lg font-bold">4.99 zł</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '80%'}}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">↑ Wzrost o 20% w weekend</span>
                        <span className="text-gray-500">Kup dziś!</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Chleb żytni</h5>
                        <span className="text-lg font-bold">2.99 zł</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600">→ Stabilna cena</span>
                        <span className="text-gray-500">Kup kiedy chcesz</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">📊 Kalendarz oszczędności</h4>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
                      <div key={day} className="text-center text-sm font-medium p-2">{day}</div>
                    ))}
                    {Array.from({length: 28}, (_, i) => (
                      <div key={i} className={`p-2 text-center text-sm rounded ${
                        i % 7 === 1 || i % 7 === 2 ? 'bg-green-200 text-green-800' :
                        i % 7 === 5 || i % 7 === 6 ? 'bg-red-200 text-red-800' :
                        'bg-gray-100'
                      }`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                      <span>Najlepsze dni na zakupy (średnio 12% taniej)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                      <span>Drogie dni (weekend, przedświąteczne)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                      <span>Normalne ceny</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Optimizer Demo */}
          {activeFeature === 'budget-optimizer' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">💰 Optymalizator budżetu</h3>
                <p className="text-gray-600 mb-8">Maksymalizuj wartość zakupów w ramach swojego budżetu</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">📊 Analiza wydatków</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Nabiał</span>
                        <span>40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Mięso</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Warzywa</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Inne</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '10%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">💡 Rekomendacje AI</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center mb-1">
                        <span className="text-green-600 mr-2">💰</span>
                        <span className="font-medium text-sm">Zamień Hochland na Tutek</span>
                      </div>
                      <p className="text-xs text-gray-600">Oszczędność: 2.40 zł</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center mb-1">
                        <span className="text-blue-600 mr-2">🏪</span>
                        <span className="font-medium text-sm">Kup owoce w LIDL</span>
                      </div>
                      <p className="text-xs text-gray-600">18% taniej niż w Carrefour</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <div className="flex items-center mb-1">
                        <span className="text-purple-600 mr-2">⏰</span>
                        <span className="font-medium text-sm">Poczekaj 2 dni z mięsem</span>
                      </div>
                      <p className="text-xs text-gray-600">Spadek ceny o 15%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">🎯 Osiągnięte oszczędności</h4>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600">47.80 zł</div>
                    <div className="text-sm text-gray-600">zaoszczędzone w tym miesiącu</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Promocje:</span>
                      <span className="font-bold">+22.40 zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optymalne sklepy:</span>
                      <span className="font-bold">+15.20 zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timing zakupów:</span>
                      <span className="font-bold">+10.20 zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Features Demo */}
          {activeFeature === 'location-features' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">🗺️ Funkcje lokalizacji</h3>
                <p className="text-gray-600 mb-8">Znajdź najlepsze sklepy w swojej okolicy z optymalizacją trasy</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">📍 Sklepy w pobliżu</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Biedronka', distance: '120m', time: '2 min', savings: '12%', open: true },
                      { name: 'LIDL', distance: '450m', time: '6 min', savings: '18%', open: true },
                      { name: 'Carrefour', distance: '1.2km', time: '15 min', savings: '8%', open: false },
                      { name: 'Netto', distance: '800m', time: '10 min', savings: '15%', open: true }
                    ].map((store, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${store.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <h5 className="font-medium">{store.name}</h5>
                            <p className="text-sm text-gray-600">{store.distance} • {store.time} pieszo</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-bold">{store.savings}</div>
                          <div className="text-xs text-gray-500">oszczędności</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-all">
                    🗺️ Pokaż na mapie
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">🚗 Optymalna trasa</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4">
                      <h5 className="font-bold text-green-600 mb-2">🎯 Rekomendowana trasa:</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mr-3">1</span>
                          <span>LIDL - nabiał, owoce (18% taniej)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mr-3">2</span>
                          <span>Biedronka - mięso, warzywa (12% taniej)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mr-3">3</span>
                          <span>Netto - produkty czyszczące (15% taniej)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">2.1 km</div>
                        <div className="text-sm text-gray-600">całkowita trasa</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">25 min</div>
                        <div className="text-sm text-gray-600">czas zakupów</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-100 rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-800">34.50 zł oszczędności</div>
                        <div className="text-sm text-green-600">vs. zakupy w jednym sklepie</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile App Demo */}
          {activeFeature === 'mobile-app' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">📱 Aplikacja mobilna</h3>
                <p className="text-gray-600 mb-8">Wszystkie funkcje zawsze pod ręką z zaawansowanymi możliwościami mobile</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">📸 Skanowanie produktów</h4>
                  <div className="bg-black rounded-2xl p-4 aspect-square flex items-center justify-center mb-4">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="w-32 h-32 border-2 border-green-400 rounded-lg relative">
                        <div className="absolute inset-2 border border-green-400 rounded"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-400 text-xs">
                          MLEKO ŁACIATE
                        </div>
                      </div>
                      <p className="text-sm mt-2">Skanuj kod kreskowy</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white rounded-xl p-3">
                      <div className="font-medium">Mleko Łaciate 3.2% 1L</div>
                      <div className="text-gray-600">Najlepsza cena: 3.29 zł w LIDL</div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
                      ➕ Dodaj do listy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">🔔 Smart powiadomienia</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                      <div className="font-medium text-green-800">🎉 Promocja!</div>
                      <div className="text-sm text-gray-600">Twoje ulubione mleko -20% w LIDL</div>
                      <div className="text-xs text-gray-500">2 minuty temu</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="font-medium text-blue-800">📍 W pobliżu</div>
                      <div className="text-sm text-gray-600">Jesteś blisko Biedronki - 3 produkty z listy</div>
                      <div className="text-xs text-gray-500">5 minut temu</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500">
                      <div className="font-medium text-yellow-800">⏰ Przypomnienie</div>
                      <div className="text-sm text-gray-600">Jutro kończy się promocja na banany</div>
                      <div className="text-xs text-gray-500">10 minut temu</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-4">🏪 Nawigacja w sklepie</h4>
                  <div className="bg-white rounded-2xl p-4 mb-4">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Array.from({length: 16}, (_, i) => (
                        <div key={i} className={`aspect-square rounded ${
                          [2, 5, 8, 11].includes(i) ? 'bg-blue-200' : 'bg-gray-100'
                        } flex items-center justify-center text-xs`}>
                          {[2, 5, 8, 11].includes(i) ? '🛒' : ''}
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-sm text-gray-600">Plan sklepu Biedronka</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-white rounded-xl p-2">
                      <span>🥛 Mleko - Rząd 2</span>
                      <span className="text-blue-600">→</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-xl p-2">
                      <span>🍞 Chleb - Rząd 5</span>
                      <span className="text-gray-400">✓</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-xl p-2">
                      <span>🧀 Ser - Rząd 3</span>
                      <span className="text-gray-400">○</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">🚀 Przyszłość już za rogiem!</h3>
            <p className="text-xl mb-6">
              Te funkcje będą dostępne w pełnej wersji GroceryCompare Poland
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                🛒 Wypróbuj obecne funkcje
              </Link>
              <Link href="/" className="border-2 border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/10 transition-all">
                📧 Zapisz się na powiadomienia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 