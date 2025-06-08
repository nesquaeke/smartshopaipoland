'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  category_name: string;
  category_icon: string;
  price_at_store: {
    store_name: string;
    price: number;
    is_promotion?: boolean;
    discount_percentage?: number;
  };
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
  products: Product[];
}

interface GroupedStores {
  [storeType: string]: Store[];
}

// Mock data for GitHub Pages
const mockStoresWithProducts: Store[] = [
  {
    id: 1,
    name: "Biedronka",
    type: "discount",
    website: "https://biedronka.pl",
    categories: ["Owoce", "Nabiał", "Mięso"],
    location_count: 3000,
    logo: "🐞",
    products: [
      {
        id: 1,
        name: "Banany",
        description: "Świeże banany z Ekwadoru",
        brand: "Chiquita",
        category_name: "Owoce",
        category_icon: "🍌",
        price_at_store: { store_name: "Biedronka", price: 3.99, is_promotion: true, discount_percentage: 20 },
        prices: [
          { store_name: "Biedronka", price: 3.99, is_promotion: true, discount_percentage: 20 },
          { store_name: "LIDL", price: 4.29 }
        ]
      },
      {
        id: 2,
        name: "Mleko 3.2%",
        description: "Świeże mleko",
        brand: "Łaciate",
        category_name: "Nabiał",
        category_icon: "🥛",
        price_at_store: { store_name: "Biedronka", price: 2.89 },
        prices: [
          { store_name: "Biedronka", price: 2.89 },
          { store_name: "LIDL", price: 2.79 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "LIDL",
    type: "discount",
    website: "https://lidl.pl",
    categories: ["Owoce", "Nabiał", "Organiczne"],
    location_count: 800,
    logo: "🔵",
    products: [
      {
        id: 1,
        name: "Banany",
        description: "Świeże banany z Ekwadoru",
        brand: "Chiquita",
        category_name: "Owoce",
        category_icon: "🍌",
        price_at_store: { store_name: "LIDL", price: 4.29 },
        prices: [
          { store_name: "Biedronka", price: 3.99 },
          { store_name: "LIDL", price: 4.29 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Żabka",
    type: "convenience",
    website: "https://zabka.pl",
    categories: ["Napoje", "Przekąski", "Gotowce"],
    location_count: 8000,
    logo: "🐸",
    products: [
      {
        id: 3,
        name: "Woda 0.5L",
        description: "Woda mineralna",
        brand: "Żywiec Zdrój",
        category_name: "Napoje",
        category_icon: "💧",
        price_at_store: { store_name: "Żabka", price: 1.99 },
        prices: [
          { store_name: "Żabka", price: 1.99 },
          { store_name: "Biedronka", price: 1.79 }
        ]
      }
    ]
  }
];

function StoresContent() {
  const [storesWithProducts, setStoresWithProducts] = useState<Store[]>([]);
  const [groupedStores, setGroupedStores] = useState<GroupedStores>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);

  useEffect(() => {
    fetchStoresWithProducts();
  }, []);

  const translateCategory = (category: string): string => {
    const translations: { [key: string]: string } = {
      'fruits': 'Owoce',
      'bread': 'Pieczywo',
      'dairy': 'Nabiał',
      'meat': 'Mięso',
      'vegetables': 'Warzywa',
      'drinks': 'Napoje',
      'sweets': 'Słodycze',
      'snacks': 'Przekąski',
      'beverages': 'Napoje',
      'frozen': 'Mrożonki',
      'canned': 'Konserwy',
      'household': 'Gospodarstwo domowe',
      'personal_care': 'Higiena osobista',
      'electronics': 'Elektronika',
      'home_improvement': 'Dom i ogród',
      'furniture': 'Meble',
      'beauty': 'Kosmetyki',
      'health': 'Zdrowie'
    };
    return translations[category] || category;
  };

  const fetchStoresWithProducts = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      try {
        const [storesResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:3535/api/stores'),
          fetch('http://localhost:3535/api/products')
        ]);
        
        if (storesResponse.ok && productsResponse.ok) {
          const storesData = await storesResponse.json();
          const productsData = await productsResponse.json();
          
          // Combine stores with their products
          const stores = storesData.stores || [];
          const products = productsData.products || [];
          
          const storesWithProducts = stores.map((store: any) => ({
            ...store,
            categories: store.categories?.map((cat: string) => translateCategory(cat)) || [],
            products: products.filter((product: any) => 
              product.prices?.some((price: any) => price.store_name === store.name)
            ).map((product: any) => ({
              ...product,
              price_at_store: product.prices?.find((price: any) => price.store_name === store.name) || { store_name: store.name, price: 0 }
            }))
          }));
          
          setStoresWithProducts(storesWithProducts);
          
          // Group stores by type
          const grouped = groupStoresByType(storesWithProducts);
          setGroupedStores(grouped);
          return; // Exit if API call is successful
        }
      } catch (apiError) {
        console.warn('API not available, falling back to mock data:', apiError);
      }
      
      // Fallback to mock data if API is not available
      setStoresWithProducts(mockStoresWithProducts);
      
      // Group stores by type
      const grouped = groupStoresByType(mockStoresWithProducts);
      setGroupedStores(grouped);
    } catch (error) {
      console.error('Error fetching stores with products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupStoresByType = (stores: Store[]): GroupedStores => {
    const grouped: GroupedStores = {};
    
    stores.forEach(store => {
      const storeType = store.type;
      if (!grouped[storeType]) {
        grouped[storeType] = [];
      }
      grouped[storeType].push(store);
    });

    return grouped;
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} zł`;
  };

  const getBestPrice = (prices: any[]) => {
    return Math.min(...prices.map(p => p.price));
  };

  const storeTypes = [
    { value: '', label: 'Wszystkie sklepy', icon: '🏪' },
    { value: 'discount', label: 'Dyskonty', icon: '🔴' },
    { value: 'hypermarket', label: 'Hipermarkety', icon: '🛒' },
    { value: 'convenience', label: 'Convenience', icon: '🐸' },
    { value: 'drugstore', label: 'Drogerie', icon: '💊' },
    { value: 'furniture', label: 'Meble', icon: '🏠' },
    { value: 'home_improvement', label: 'Budowlane', icon: '🔨' }
  ];

  const getTypeInfo = (type: string) => {
    return storeTypes.find(t => t.value === type) || { label: type.replace('_', ' '), icon: '🏪' };
  };

  const selectedTypeInfo = storeTypes.find(t => t.value === selectedType);

  // Filter stores based on selected type
  const filteredStores = selectedType 
    ? storesWithProducts.filter(store => store.type === selectedType)
    : storesWithProducts;

  const filteredGroupedStores = selectedType 
    ? { [selectedType]: groupedStores[selectedType] || [] }
    : groupedStores;

  // Add cart functionality
  const addToCart = async (productId: number, storeId: number) => {
    try {
      const store = storesWithProducts.find(s => s.id === storeId);
      const product = store?.products.find(p => p.id === productId);
      
      if (!store || !product) return;

      const cartItem = {
        id: Date.now(),
        product_id: productId,
        product_name: product.name,
        product_description: product.description,
        category_icon: product.category_icon,
        brand: product.brand,
        store_name: store.name,
        store_id: storeId,
        price: product.price_at_store?.price || 0,
        quantity: 1,
        original_price: product.price_at_store?.price ? product.price_at_store.price * 1.2 : undefined,
        is_promotion: product.price_at_store?.is_promotion || false,
        discount_percentage: product.price_at_store?.discount_percentage || 0
      };

      // Save to localStorage
      const existingCart = JSON.parse(localStorage.getItem('smartshop_cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: any) => 
        item.product_id === productId && item.store_id === storeId
      );

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('smartshop_cart', JSON.stringify(existingCart));
      setCart(existingCart);

      // Show success feedback
      const button = document.querySelector(`[data-product-id="${productId}"]`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Dodano!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-600');
        }, 2000);
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              <Link href="/stores" className="text-blue-600 font-bold border-b-2 border-blue-600">
                Sklepy
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Kategorie
              </Link>
              <Link href="/ai" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all font-medium">
                🤖 AI Asystent
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedTypeInfo ? `${selectedTypeInfo.label} z produktami` : 'Sklepy według produktów'}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Główna</Link>
            <span>/</span>
            <span className="text-blue-600">Sklepy</span>
            {selectedTypeInfo && selectedTypeInfo.value && (
              <>
                <span>/</span>
                <span className="text-blue-600">{selectedTypeInfo.label}</span>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {storeTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeFilter(type.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedType === type.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stores with Products */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <div className="text-xl text-gray-600">Ładowanie sklepów z produktami...</div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl text-gray-600 mb-2">Nie znaleziono sklepów</div>
            <div className="text-gray-500">Spróbuj zmienić typ sklepu</div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                Znaleziono <span className="font-bold text-blue-600">{filteredStores.length}</span> sieci handlowych
              </div>
              <div className="text-sm text-gray-500">
                Łącznie: <span className="font-semibold">
                  {filteredStores.reduce((sum, store) => sum + store.products.length, 0)}
                </span> dostępnych produktów
              </div>
            </div>

            {/* Store Sections */}
            <div className="space-y-12">
              {filteredStores.map((store) => (
                <div key={store.id} className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  {/* Store Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <span className="text-6xl mr-6">{store.logo}</span>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">{store.name}</h3>
                        <p className="text-gray-600 capitalize text-lg">{getTypeInfo(store.type).label}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-blue-600 font-semibold">
                            {store.products.length} produktów dostępnych
                          </span>
                          <span className="text-gray-500">
                            {store.location_count.toLocaleString()}+ lokalizacji
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
                      >
                        🌐 Strona
                      </a>
                      <Link
                        href={`/stores/${store.id}`}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                      >
                        Zobacz szczegóły
                      </Link>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {store.products.slice(0, 12).map((product) => {
                      const bestPriceOverall = getBestPrice(product.prices);
                      const isCurrentStoreBest = product.price_at_store?.price === bestPriceOverall;
                      
                      return (
                        <div key={product.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-blue-300 hover:scale-105 transform cursor-pointer">
                          <div className="p-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                  <span className="text-lg mr-2 group-hover:scale-125 transition-transform duration-300">{product.category_icon}</span>
                                  <div>
                                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                      {product.name}
                                    </h4>
                                    <p className="text-gray-600 text-xs mt-1">{product.brand}</p>
                                  </div>
                                </div>
                                {product.price_at_store?.is_promotion && (
                                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                                    🔥 -{product.price_at_store.discount_percentage}%
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                              
                              <div className="space-y-2 mb-3">
                                <div className={`flex justify-between items-center p-2 rounded-lg ${
                                  isCurrentStoreBest 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                                    : 'bg-blue-50 border border-blue-200'
                                }`}>
                                  <span className="text-xs font-bold text-gray-800">{store.name}</span>
                                  <span className={`font-bold text-sm ${
                                    isCurrentStoreBest ? 'text-green-700' : 'text-blue-700'
                                  }`}>
                                    {formatPrice(product.price_at_store?.price || 0)}
                                  </span>
                                </div>
                                
                                {!isCurrentStoreBest && (
                                  <div className="text-center text-xs text-gray-500 py-1">
                                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                      💰 Najtaniej: {formatPrice(bestPriceOverall)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="text-xs text-gray-600">
                                  <span className={`font-semibold ${isCurrentStoreBest ? 'text-green-600' : 'text-blue-600'}`}>
                                    {isCurrentStoreBest ? '🏆 Najlepsze' : '💙 Dostępne'}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => addToCart(product.id, store.id)}
                                    data-product-id={product.id}
                                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-2 py-1.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-xs transform hover:scale-110"
                                  >
                                    🛒
                                  </button>
                                  <Link
                                    href={`/products/${product.id}`}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2 py-1.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-xs transform hover:scale-110"
                                  >
                                    🔍
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {store.products.length > 12 && (
                    <div className="text-center mt-6">
                      <Link
                        href={`/stores/${store.id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2"
                      >
                        <span>Zobacz wszystkie {store.products.length} produktów</span>
                        <span>→</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StoresContent; 