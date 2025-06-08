'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category_name: string;
  category_icon?: string;
  category_id?: number;
  prices: {
    store_name: string;
    price: number;
    is_promotion?: boolean;
    discount_percentage?: number;
  }[];
  // Computed fields for display
  price?: number;
  store?: string;
  category?: string;
  originalPrice?: number;
  unit?: string;
  weight?: number;
  discount?: number;
  promotion?: boolean;
  image?: string;
}

interface Store {
  id: number;
  name: string;
  logo: string;
  type: string;
}

interface Category {
  name: string;
  count: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sort', sortBy);
      params.append('limit', '50');

      const productsResponse = await fetch(`http://localhost:3535/api/products?${params}`);
      if (!productsResponse.ok) {
        throw new Error(`Products API error: ${productsResponse.status}`);
      }
      const productsData = await productsResponse.json();
      
      // Transform products to match UI expectations
      const transformedProducts = (productsData.products || []).map((product: any) => {
        // Get the cheapest price and store
        const cheapestPrice = product.prices && product.prices.length > 0 
          ? product.prices.reduce((min: any, curr: any) => curr.price < min.price ? curr : min)
          : null;

        return {
          ...product,
          price: cheapestPrice?.price || 0,
          store: cheapestPrice?.store_name || 'Nieznany',
          category: product.category_name || 'Inne',
          unit: 'szt',
          promotion: cheapestPrice?.is_promotion || false,
          originalPrice: cheapestPrice?.discount_percentage 
            ? cheapestPrice.price / (1 - cheapestPrice.discount_percentage / 100)
            : undefined
        };
      });
      
      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:3535/api/categories');
      if (!categoriesResponse.ok) {
        throw new Error(`Categories API error: ${categoriesResponse.status}`);
      }
      const categoriesData = await categoriesResponse.json();

      // Fetch stores
      const storesResponse = await fetch('http://localhost:3535/api/stores');
      if (!storesResponse.ok) {
        throw new Error(`Stores API error: ${storesResponse.status}`);
      }
      const storesData = await storesResponse.json();

      setProducts(transformedProducts);
      setTotal(productsData.total || transformedProducts.length);
      setCategories(categoriesData.categories || []);
      setStores(storesData.stores || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił błąd podczas ładowania danych');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.store?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          store: product.store,
          category: product.category,
          unit: product.unit,
          quantity: 1
        });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert('Produkt dodany do koszyka! 🛒');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Błąd podczas dodawania do koszyka');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300 bg-white/90 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center">
                <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">SmartShopAI</h1>
                  <span className="text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded-full">Powered by AI, Perfected for Savings</span>
                </div>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Błąd ładowania danych</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-all duration-300 bg-white/90 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">SmartShopAI</h1>
                <span className="text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded-full">Powered by AI, Perfected for Savings</span>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Link href="/sepet" className="relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 text-gray-800 hover:from-emerald-200 hover:to-blue-200 shadow-lg hover:shadow-xl block">
                  <span className="text-xl">🛒</span>
                </Link>
                <div className="text-xs text-center mt-1 font-medium text-gray-600">Sepetim</div>
              </div>
              <button className="px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 text-purple-800 hover:from-purple-200 hover:to-indigo-200 shadow-lg hover:shadow-xl">
                🇺🇸 EN
              </button>
              <button className="p-3 rounded-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl">
                🌙
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Produkty według kategorii</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Główna</Link>
            <span>/</span>
            <span className="text-blue-600">Produkty</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Szukaj produktów..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium bg-emerald-100 hover:bg-emerald-200">
                  🔍 Szukaj
                </button>
              </div>
            </div>
            <div className="lg:w-64">
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:w-48">
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sortuj: Nazwa</option>
                <option value="price">Sortuj: Cena ↑</option>
                <option value="price_desc">Sortuj: Cena ↓</option>
                <option value="store">Sortuj: Sklep</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Znaleziono {filteredProducts.length} z {total} produktów
            {selectedCategory && ` w kategorii "${selectedCategory}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie produktów...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-6">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{product.category_name}</span>
                    </div>
                    {product.promotion && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">PROMOCJA</span>
                    )}
                  </div>

                  {/* Store Info */}
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      🏪 {product.store}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">{product.price?.toFixed(2) || 'N/A'} zł</span>
                        <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-right">
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} zł</span>
                          <span className="text-sm text-red-600 font-bold block">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  {product.weight && (
                    <p className="text-sm text-gray-600 mb-4">Waga: {product.weight}g</p>
                  )}
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-4">Marka: {product.brand}</p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg"
                  >
                    🛒 Dodaj do koszyka
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nie znaleziono produktów</h3>
            <p className="text-gray-600 mb-4">Spróbuj zmienić kryteria wyszukiwania</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium"
            >
              Wyczyść filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
} 