'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

interface Category {
  id: number;
  name: string;
  name_pl: string;
  icon: string;
  product_count: number;
}

interface GroupedProducts {
  [categoryId: number]: {
    category: Category;
    products: Product[];
  };
}

interface Store {
  id: number;
  name: string;
  type: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const searchParams = useSearchParams();

  // Multilingual texts
  const texts = {
    pl: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      title: "Wszystkie Produkty",
      subtitle: "Znajdź najlepsze ceny w całej Polsce",
      searchPlaceholder: "Szukaj produktów...",
      searchButton: "Szukaj",
      addToCart: "Dodaj",
      addToFavorites: "Dodaj do ulubionych",
      addToCompare: "Dodaj do porównania",
      bestPrice: "Najlepsza cena",
      promotion: "PROMOCJA",
      noProducts: "Nie znaleziono produktów",
      category: "Kategoria",
      allCategories: "Wszystkie kategorie",
      sortBy: "Sortuj według",
      sortPrice: "Ceny",
      sortName: "Nazwy",
      sortBrand: "Marki"
    },
    en: {
      siteName: "SmartShopAI",
      motto: "Powered by AI, Perfected for Savings",
      title: "All Products",
      subtitle: "Find the best prices across Poland",
      searchPlaceholder: "Search products...",
      searchButton: "Search",
      addToCart: "Add",
      addToFavorites: "Add to Favorites",
      addToCompare: "Add to Compare",
      bestPrice: "Best Price",
      promotion: "PROMOTION",
      noProducts: "No products found",
      category: "Category",
      allCategories: "All categories",
      sortBy: "Sort by",
      sortPrice: "Price",
      sortName: "Name",
      sortBrand: "Brand"
    }
  };

  const t = texts[language];

  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const searchParam = searchParams?.get('search');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    fetchData();
    fetchStores();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const categoryParam = searchParams?.get('category');
      const searchParam = searchParams?.get('search');
      
      let productsUrl = 'http://localhost:3535/api/products?limit=100';
      if (categoryParam) {
        productsUrl += `&category=${categoryParam}`;
      }
      if (searchParam) {
        productsUrl += `&search=${searchParam}`;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(productsUrl),
        fetch('http://localhost:3535/api/products/categories')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const fetchedProducts = productsData.data || [];
        setProducts(fetchedProducts);
        
        // Group products by category
        const grouped = groupProductsByCategory(fetchedProducts);
        setGroupedProducts(grouped);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:3535/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const groupProductsByCategory = (products: Product[]): GroupedProducts => {
    const grouped: GroupedProducts = {};
    
    products.forEach(product => {
      const categoryId = product.category_id;
      if (!grouped[categoryId]) {
        const category = categories.find(c => c.id === categoryId) || {
          id: categoryId,
          name: product.category_name.toLowerCase(),
          name_pl: product.category_name,
          icon: product.category_icon,
          product_count: 0
        };
        grouped[categoryId] = {
          category,
          products: []
        };
      }
      grouped[categoryId].products.push(product);
    });

    return grouped;
  };

  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      const grouped = groupProductsByCategory(products);
      setGroupedProducts(grouped);
    }
  }, [products, categories]);

  const handleSearch = () => {
    setIsLoading(true);
    fetchData();
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
      const product = products.find(p => p.id === productId);
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

      const highestPrice = Math.max(...product.prices.map(p => p.price));
      const savings = highestPrice - price.price;

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

      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
      toastDiv.innerHTML = `✅ ${product.name} dodany do koszyka!<br/>💰 Oszczędzasz: ${savings.toFixed(2)} zł`;
      document.body.appendChild(toastDiv);
      setTimeout(() => document.body.removeChild(toastDiv), 4000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToFavorites = async (productId: number) => {
    setFavoriteItems(prev => [...prev, productId]);
    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
    toastDiv.innerHTML = '❤️ Dodano do ulubionych!';
    document.body.appendChild(toastDiv);
    setTimeout(() => document.body.removeChild(toastDiv), 3000);
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
    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold';
    toastDiv.innerHTML = `⚖️ ${product.name} dodany do porównania (${compareList.length + 1}/3)`;
    document.body.appendChild(toastDiv);
    setTimeout(() => document.body.removeChild(toastDiv), 3000);
  };

  const selectedCategoryName = categories.find(c => c.id.toString() === selectedCategory)?.name_pl || '';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedCategoryName ? `Kategoria: ${selectedCategoryName}` : 'Produkty według kategorii'}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Główna</Link>
            <span>/</span>
            <span className="text-blue-600">Produkty</span>
            {selectedCategoryName && (
              <>
                <span>/</span>
                <span className="text-blue-600">{selectedCategoryName}</span>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t.searchPlaceholder}
                  className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  onClick={handleSearch}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-emerald-100 hover:bg-emerald-200'
                  }`}
                >
                  🔍 {t.searchButton}
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">{t.allCategories}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name_pl}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  window.location.href = '/products';
                }}
                className={`px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Wyczyść filtry
              </button>
            )}
          </div>
        </div>

        {/* Products by Categories */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ładowanie produktów...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl text-gray-600 mb-2">{t.noProducts}</div>
            <div className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania</div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                Znaleziono <span className="font-bold text-blue-600">{products.length}</span> produktów
              </div>
            </div>

            {/* Category Sections */}
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([categoryId, { category, products }]) => (
                <div key={categoryId} className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <span className="text-5xl mr-4">{category.icon}</span>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">{category.name_pl}</h3>
                        <p className="text-gray-600">{products.length} produktów dostępnych</p>
                      </div>
                    </div>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                    >
                      Zobacz wszystkie
                    </Link>
                  </div>

                  {/* Products Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: Product) => {
                      const bestStore = getBestStore(product.prices);
                      const bestPrice = getBestPrice(product.prices);
                      const hasPromotion = product.prices.some((p: any) => p.is_promotion);
                      
                      return (
                        <div key={product.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-blue-300 hover:scale-105 transform cursor-pointer relative">
                          <div className="p-6 relative">
                            {/* Animated glowing effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3 group-hover:scale-125 transition-transform duration-500 filter group-hover:drop-shadow-xl">{product.category_icon}</span>
                                  <div>
                                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                      {product.name}
                                    </h4>
                                    <p className="text-gray-600 text-sm mt-1 group-hover:text-blue-500 transition-colors duration-300">{product.brand}</p>
                                  </div>
                                </div>
                                {hasPromotion && (
                                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                                    🔥 PROMOCJA
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">{product.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                {product.prices.slice(0, 2).map((price: any, index: number) => (
                                  <div 
                                    key={index}
                                    className={`flex justify-between items-center p-2 rounded-lg transition-all duration-300 ${
                                      price.price === bestPrice 
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                                        : 'bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium text-gray-800">{price.store_name}</span>
                                      {price.is_promotion && (
                                        <span className="ml-1 bg-red-100 text-red-700 px-1 py-0.5 rounded text-xs font-medium">
                                          -{price.discount_percentage}%
                                        </span>
                                      )}
                                    </div>
                                    <span className={`font-bold text-sm ${
                                      price.price === bestPrice ? 'text-green-700' : 'text-gray-900'
                                    }`}>
                                      {formatPrice(price.price)}
                                    </span>
                                  </div>
                                ))}
                                {product.prices.length > 2 && (
                                  <div className="text-center text-xs text-gray-500 py-1">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                                      +{product.prices.length - 2} więcej sklepów
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-600">
                                  <span className="font-semibold text-green-600">{bestStore?.store_name}</span>
                                  <div className="text-xs">💚 najlepsze</div>
                                </div>
                                <Link
                                  href={`/products/${product.id}`}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-xs transform hover:scale-110"
                                >
                                  🔍 Zobacz
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Premium glow effect */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-xl"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Shopping Cart Panel */}
      {cart.length > 0 && (
        <section className={`fixed bottom-4 left-4 rounded-3xl shadow-2xl border p-6 z-50 max-w-sm transition-all duration-300 ${
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
                    <p className="text-sm font-bold text-emerald-600">{formatPrice(item.price)}</p>
                    {item.savings > 0 && (
                      <p className="text-xs text-emerald-600">💰 Oszczędność: {item.savings.toFixed(2)} zł</p>
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
              <span className="font-bold text-lg text-emerald-600">
                {formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">{language === 'pl' ? 'Oszczędności:' : 'Savings:'}</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatPrice(cart.reduce((sum, item) => sum + (item.savings * item.quantity), 0))}
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              🛒 {language === 'pl' ? 'Przejdź do kasy' : 'Checkout'}
            </button>
          </div>
        </section>
      )}

      {/* Compare Panel */}
      {compareList.length > 0 && (
        <section className={`fixed bottom-4 right-4 rounded-3xl shadow-2xl border p-6 z-50 max-w-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">⚖️ {language === 'pl' ? 'Porównanie' : 'Compare'}</h3>
            <button 
              onClick={() => setCompareList([])}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {compareList.map((product) => {
              const bestPrice = getBestPrice(product.prices);
              return (
                <div key={product.id} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-bold text-sm">{product.name}</h5>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.brand}</p>
                      <p className="text-sm font-bold text-emerald-600">{formatPrice(bestPrice)}</p>
                    </div>
                    <button
                      onClick={() => setCompareList(prev => prev.filter(p => p.id !== product.id))}
                      className="text-red-500 hover:text-red-700 font-bold text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
} 