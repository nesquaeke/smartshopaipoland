import { Metadata } from 'next';

// Static export için gerekli params
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];
}

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

// Statik veri kullanacağız
const mockStores: { [key: string]: Store } = {
  '1': {
    id: 1,
    name: 'Biedronka',
    type: 'discount',
    website: 'https://www.biedronka.pl',
    categories: ['fruits', 'bread', 'dairy'],
    location_count: 3000,
    logo: '🐞'
  },
  '2': {
    id: 2,
    name: 'Żabka',
    type: 'convenience', 
    website: 'https://www.zabka.pl',
    categories: ['snacks', 'drinks', 'essentials'],
    location_count: 8000,
    logo: '🐸'
  },
  '3': {
    id: 3,
    name: 'LIDL',
    type: 'discount',
    website: 'https://www.lidl.pl', 
    categories: ['organic', 'bread', 'meat', 'dairy'],
    location_count: 800,
    logo: '🔵'
  }
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Banan",
    description: "Słodkie banany z Ekwadoru",
    brand: "Tropical",
    category_id: 1,
    category_name: "Owoce",
    category_icon: "🍌",
    prices: [
      { store_name: "Biedronka", price: 4.99 },
      { store_name: "LIDL", price: 4.79 },
      { store_name: "Żabka", price: 5.49 }
    ]
  },
  {
    id: 2,
    name: "Mleko 3.2%",
    description: "Świeże mleko od lokalnych dostawców",
    brand: "Łaciate",
    category_id: 2,
    category_name: "Nabiał",
    category_icon: "🥛",
    prices: [
      { store_name: "Biedronka", price: 3.49 },
      { store_name: "LIDL", price: 3.29 },
      { store_name: "Żabka", price: 3.99 }
    ]
  }
];

export default function StoreDetailPage({ params }: { params: { id: string } }) {
  const store = mockStores[params.id];
  
  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Store not found</h2>
          <a href="/stores" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg">
            ← Back to stores
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="backdrop-blur-md shadow-sm border-b sticky top-0 z-50 bg-white/90 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center">
              <span className="text-3xl mr-3 drop-shadow-lg">🛒</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartShopAI
                </h1>
                <span className="text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded-full">
                  Powered by AI, Perfected for Savings
                </span>
              </div>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Header */}
        <div className="rounded-3xl shadow-xl p-8 mb-8 border bg-white/50 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-8xl mr-6">{store.logo}</span>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-900">{store.name}</h1>
                <p className="text-lg mb-2 capitalize text-gray-600">
                  {store.type?.replace('_', ' ')} • {store.location_count?.toLocaleString()}+ locations
                </p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {mockProducts.length} Products
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {store.categories.length} Categories
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="/stores" className="px-6 py-3 rounded-2xl font-medium bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300">
                ← Back to stores
              </a>
              <a
                href={store.website}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition-all hover:shadow-lg"
              >
                🌐 Website
              </a>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="rounded-3xl shadow-xl p-8 border bg-white/50 border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Products ({mockProducts.length})</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div key={product.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border hover:scale-105 transform bg-white border-gray-200 hover:border-emerald-300">
                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3 group-hover:scale-125 transition-transform duration-300">{product.category_icon}</span>
                      <div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-emerald-600 transition-colors text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4 text-gray-600">{product.description}</p>
                  
                  <div className="p-4 rounded-xl mb-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{store.name}</span>
                      <span className="font-bold text-lg text-gray-900">
                        {product.prices.find(p => p.store_name === store.name)?.price.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600">
                      🤍
                    </button>
                    
                    <div className="flex gap-2">
                      <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all hover:shadow-lg transform hover:scale-105">
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 