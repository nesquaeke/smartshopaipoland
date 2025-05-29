'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  name_pl: string;
  icon: string;
  product_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3535/api/products/categories');
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.product_count, 0);

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
              <Link href="/stores" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sklepy
              </Link>
              <Link href="/categories" className="text-blue-600 font-bold border-b-2 border-blue-600">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Kategorie produktów</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Główna</Link>
            <span>/</span>
            <span className="text-blue-600">Kategorie</span>
          </div>
          <p className="text-gray-600 mt-4">
            Przeglądaj produkty według kategorii i znajdź najlepsze ceny w różnych sklepach
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <div className="text-xl text-gray-600">Ładowanie kategorii...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl text-gray-600 mb-2">Nie znaleziono kategorii</div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
                  <div className="text-gray-600">Kategorii</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{totalProducts}</div>
                  <div className="text-gray-600">Produktów</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(totalProducts / categories.length)}
                  </div>
                  <div className="text-gray-600">Średnio na kategorię</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group transform hover:scale-105 cursor-pointer relative overflow-hidden"
                >
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform filter group-hover:drop-shadow-lg">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {category.name_pl}
                    </h3>
                    <div className="text-gray-600 text-sm mb-3 group-hover:text-blue-500 transition-colors">
                      {category.name}
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-blue-200 group-hover:scale-105 transform transition-all duration-300">
                      {category.product_count} produktów
                    </div>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transform group-hover:scale-105 transition-transform shadow-lg">
                        Zobacz produkty →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Popular Categories Highlight */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Najpopularniejsze kategorie</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {categories
                  .sort((a, b) => b.product_count - a.product_count)
                  .slice(0, 3)
                  .map((category, index) => (
                    <div key={category.id} className="text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <div className="font-bold text-lg mb-2">{category.name_pl}</div>
                      <div className="text-blue-100 text-sm mb-3">
                        {category.product_count} produktów
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        #{index + 1} najpopularniejsza
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* All Categories List */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Wszystkie kategorie</h3>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {categories
                    .sort((a, b) => a.name_pl.localeCompare(b.name_pl))
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          <span className="text-3xl mr-4">{category.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {category.name_pl}
                            </div>
                            <div className="text-gray-500 text-sm">{category.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
                            {category.product_count} produktów
                          </span>
                          <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 