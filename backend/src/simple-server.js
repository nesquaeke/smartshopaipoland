const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3535;

// Middleware
app.use(cors());
app.use(express.json());

// Store type to category mapping - realistic product categories per store type
const STORE_CATEGORY_MAPPING = {
  'discount': {
    allowed_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // Almost everything except specialized items
    priority_categories: [1, 2, 3, 4, 5, 6, 7] // Food items priority
  },
  'hypermarket': {
    allowed_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], // Everything except specialized
    priority_categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  'convenience': {
    allowed_categories: [1, 2, 6, 7, 8, 12], // Quick food, drinks, snacks, hygiene
    priority_categories: [1, 2, 6, 7, 8]
  },
  'drugstore': {
    allowed_categories: [6, 7, 11, 12, 13], // Drinks, snacks, household, hygiene, baby products
    priority_categories: [12, 13]
  },
  'pharmacy': {
    allowed_categories: [12, 13], // Only hygiene and baby products (health related)
    priority_categories: [12, 13]
  },
  'furniture': {
    allowed_categories: [14], // Only furniture and home items
    priority_categories: [14]
  },
  'home_improvement': {
    allowed_categories: [11, 14, 19], // Household chemicals, home items, car products
    priority_categories: [11, 14]
  },
  'electronics': {
    allowed_categories: [15, 17], // Electronics and some games/books
    priority_categories: [15]
  },
  'clothing': {
    allowed_categories: [16, 18], // Clothing and some sports items
    priority_categories: [16]
  },
  'shoes': {
    allowed_categories: [16, 18], // Clothing/accessories and sports shoes
    priority_categories: [16, 18]
  },
  'bookstore': {
    allowed_categories: [15, 17], // Books, games, and some electronics
    priority_categories: [17]
  },
  'sports': {
    allowed_categories: [16, 18], // Sports equipment and sports clothing
    priority_categories: [18]
  },
  'retail': {
    allowed_categories: [11, 12, 13, 16], // Mixed retail items
    priority_categories: [11, 12, 16]
  },
  'petrol': {
    allowed_categories: [1, 6, 7, 8, 19], // Quick food, drinks, car products
    priority_categories: [6, 19]
  }
};

// MASSIVE Polish Products Database - 200+ products - COMPREHENSIVE LIST
const enhancedProducts = [
  // ===== PIECZYWO (Bread & Bakery) - Enhanced with traditional Polish varieties =====
  {
    id: 1,
    name: 'Chleb żytni',
    description: 'Chleb żytni tradycyjny 500g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Carrefour', price: 3.19 },
      { store_name: 'Auchan', price: 3.09 },
      { store_name: 'Netto', price: 2.89 },
      { store_name: 'Dino', price: 3.05 },
      { store_name: 'Tesco', price: 3.15 },
      { store_name: 'Stokrotka', price: 2.95 },
      { store_name: 'Polomarket', price: 2.89 }
    ]
  },
  {
    id: 2,
    name: 'Bulka zwykła',
    description: 'Klasyczna bułka biała 6 sztuk',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 1.99 },
      { store_name: 'LIDL', price: 1.89 },
      { store_name: 'Żabka', price: 2.29 },
      { store_name: 'Freshmarket', price: 2.19 },
      { store_name: 'Carrefour', price: 2.09 }
    ]
  },
  {
    id: 3,
    name: 'Kajzerka',
    description: 'Tradycyjna kajzerka 4 sztuki',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 2.49 },
      { store_name: 'LIDL', price: 2.39 },
      { store_name: 'Żabka', price: 2.79 },
      { store_name: 'Dino', price: 2.59 }
    ]
  },
  {
    id: 4,
    name: 'Bagietka francuska',
    description: 'Chrupiąca bagietka 250g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Carrefour', price: 3.99 },
      { store_name: 'Auchan', price: 3.89 },
      { store_name: 'LIDL', price: 3.69 },
      { store_name: 'Delikatesy Centrum', price: 4.49 }
    ]
  },
  {
    id: 5,
    name: 'Croissant z nadzieniem',
    description: 'Croissant czekoladowy 2 sztuki',
    brand: 'Seven Days',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Orlen', price: 4.99 },
      { store_name: 'Circle K', price: 5.29 },
      { store_name: 'Shell', price: 4.89 },
      { store_name: 'Żabka', price: 5.49 },
      { store_name: 'LIDL', price: 4.19 }
    ]
  },

  // ===== NABIAŁ (Dairy) - Polish dairy brands =====
  {
    id: 6,
    name: 'Mleko UHT 3,2%',
    description: 'Mleko UHT 3,2% tłuszczu 1L',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Carrefour', price: 3.59 },
      { store_name: 'Żabka', price: 3.89 }
    ]
  },
  {
    id: 7,
    name: 'Jogurt naturalny grecki',
    description: 'Jogurt grecki 150g',
    brand: 'Danone',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 2.29 },
      { store_name: 'LIDL', price: 2.19 },
      { store_name: 'Carrefour', price: 2.39 },
      { store_name: 'Auchan', price: 2.35 }
    ]
  },

  // ===== MEAT & FISH =====
  {
    id: 8,
    name: 'Pierś z kurczaka',
    description: 'Świeża pierś z kurczaka 1kg',
    brand: 'Drób',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Biedronka', price: 12.99 },
      { store_name: 'LIDL', price: 12.49 },
      { store_name: 'Carrefour', price: 13.99 },
      { store_name: 'Dino', price: 13.49 }
    ]
  },
  {
    id: 9,
    name: 'Polędwica sopocka',
    description: 'Tradycyjna polędwica sopocka 200g',
    brand: 'Sokołów',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Biedronka', price: 8.99 },
      { store_name: 'Dino', price: 9.49 },
      { store_name: 'Polo Market', price: 8.79 },
      { store_name: 'Delikatesy Centrum', price: 10.99 }
    ]
  },

  // ===== VEGETABLES =====
  {
    id: 10,
    name: 'Ziemniaki młode',
    description: 'Ziemniaki młode polskie 2kg',
    brand: 'Polskie',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥕',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.79 },
      { store_name: 'Carrefour', price: 5.29 },
      { store_name: 'Auchan', price: 5.19 }
    ]
  },

  // ===== BEVERAGES - Expanded with Polish favorites =====
  {
    id: 11,
    name: 'Sok pomarańczowy',
    description: 'Sok pomarańczowy 100% 1L',
    brand: 'Tymbark',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.69 },
      { store_name: 'Żabka', price: 5.49 },
      { store_name: 'Orlen', price: 5.99 }
    ]
  },
  {
    id: 12,
    name: 'Red Bull Energy',
    description: 'Napój energetyczny 250ml',
    brand: 'Red Bull',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Orlen', price: 6.99 },
      { store_name: 'Circle K', price: 7.29 },
      { store_name: 'Shell', price: 6.89 },
      { store_name: 'Żabka', price: 7.49 },
      { store_name: 'Media Markt', price: 6.59 }
    ]
  },

  // ===== IKEA FOOD PRODUCTS =====
  {
    id: 13,
    name: 'Köttbullar',
    description: 'Szwedzkie klopsiki 500g',
    brand: 'IKEA',
    category_id: 9,
    category_name: 'Mrożonki',
    category_icon: '🧊',
    prices: [
      { store_name: 'IKEA', price: 12.99 }
    ]
  },
  {
    id: 14,
    name: 'Knäckebröd',
    description: 'Szwedzkie pieczywo chrupkie 200g',
    brand: 'IKEA',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'IKEA', price: 8.99 }
    ]
  },
  {
    id: 15,
    name: 'Sylt lingon',
    description: 'Dżem z żurawiny 425g',
    brand: 'IKEA',
    category_id: 7,
    category_name: 'Słodycze',
    category_icon: '🍭',
    prices: [
      { store_name: 'IKEA', price: 7.99 }
    ]
  },

  // ===== PETROL STATION EXCLUSIVE PRODUCTS =====
  {
    id: 16,
    name: 'Hot-dog',
    description: 'Gotowy hot-dog z kiełbasą',
    brand: 'Orlen Stop',
    category_id: 29,
    category_name: 'Convenience',
    category_icon: '🏪',
    prices: [
      { store_name: 'Orlen', price: 6.99 },
      { store_name: 'Circle K', price: 7.49 },
      { store_name: 'Shell', price: 6.79 }
    ]
  },
  {
    id: 17,
    name: 'Olej silnikowy 5W-30',
    description: 'Syntetyczny olej silnikowy 4L',
    brand: 'Castrol',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '🛢️',
    prices: [
      { store_name: 'Orlen', price: 89.99 },
      { store_name: 'BP', price: 92.99 },
      { store_name: 'Shell', price: 91.99 },
      { store_name: 'Circle K', price: 88.99 }
    ]
  },

  // ===== ELECTRONICS =====
  {
    id: 18,
    name: 'Powerbank 10000mAh',
    description: 'Przenośna ładowarka 10000mAh',
    brand: 'Xiaomi',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 79.99 },
      { store_name: 'RTV Euro AGD', price: 82.99 },
      { store_name: 'Saturn', price: 77.99 },
      { store_name: 'Neonet', price: 81.49 },
      { store_name: 'Empik', price: 89.99 }
    ]
  },
  {
    id: 19,
    name: 'Słuchawki Bluetooth',
    description: 'Bezprzewodowe słuchawki douszne',
    brand: 'JBL',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 299.99 },
      { store_name: 'Saturn', price: 289.99 },
      { store_name: 'RTV Euro AGD', price: 309.99 },
      { store_name: 'Neo24', price: 295.99 }
    ]
  },

  // ===== DRUGSTORE PRODUCTS =====
  {
    id: 20,
    name: 'Krem do twarzy Nivea',
    description: 'Krem nawilżający do twarzy 50ml',
    brand: 'Nivea',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 12.99 },
      { store_name: 'Hebe', price: 14.99 },
      { store_name: 'Super-Pharm', price: 13.49 },
      { store_name: 'Doz.pl', price: 12.79 }
    ]
  },
  {
    id: 21,
    name: 'Żel pod prysznic',
    description: 'Żel pod prysznic 500ml',
    brand: 'Fa',
    category_id: 12,
    category_name: 'Higiena',
    category_icon: '🧼',
    prices: [
      { store_name: 'Rossmann', price: 7.99 },
      { store_name: 'Biedronka', price: 8.49 },
      { store_name: 'LIDL', price: 7.79 },
      { store_name: 'Hebe', price: 9.99 }
    ]
  },

  // ===== ALCOHOL =====
  {
    id: 22,
    name: 'Piwo Tyskie',
    description: 'Piwo jasne pełne 500ml',
    brand: 'Tyskie',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Biedronka', price: 3.29 },
      { store_name: 'LIDL', price: 3.19 },
      { store_name: 'Żabka', price: 3.79 },
      { store_name: 'Carrefour', price: 3.39 },
      { store_name: 'Auchan', price: 3.35 }
    ]
  },
  {
    id: 23,
    name: 'Wódka Żubrówka',
    description: 'Wódka trawiasta 500ml',
    brand: 'Żubrówka',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Carrefour', price: 32.99 },
      { store_name: 'Auchan', price: 31.99 },
      { store_name: 'Tesco', price: 33.49 },
      { store_name: 'Delikatesy Centrum', price: 34.99 }
    ]
  },

  // ===== ETHNIC FOODS =====
  // Turkish
  {
    id: 24,
    name: 'Beyaz peynir',
    description: 'Biały ser turecki 200g',
    brand: 'Pınar',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Turecki', price: 12.99 }
    ]
  },
  {
    id: 25,
    name: 'Pul biber',
    description: 'Turecka papryka płatkowa 50g',
    brand: 'Şekeroğlu',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Turecki', price: 8.99 }
    ]
  },
  // Vietnamese
  {
    id: 26,
    name: 'Makaron Pho',
    description: 'Makaron ryżowy do Pho 400g',
    brand: 'Three Ladies',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Vietnam Market', price: 9.99 }
    ]
  },
  // Ukrainian
  {
    id: 27,
    name: 'Salo ukraińskie',
    description: 'Tradycyjne salo węgierskie 300g',
    brand: 'Tradycyjne',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Ukraiński Market', price: 15.99 }
    ]
  },

  // ===== SPORTS & FITNESS =====
  {
    id: 28,
    name: 'Protein bar',
    description: 'Baton proteinowy czekoladowy 60g',
    brand: 'Domyos',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 4.99 },
      { store_name: 'Go Sport', price: 5.49 }
    ]
  },

  // ===== HOME IMPROVEMENT =====
  {
    id: 29,
    name: 'Farba lateksowa',
    description: 'Farba ścienna biała 5L',
    brand: 'Śnieżka',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 89.99 },
      { store_name: 'Castorama', price: 92.99 },
      { store_name: 'OBI', price: 87.99 },
      { store_name: 'PSB Mrówka', price: 85.99 }
    ]
  },

  // ===== PET PRODUCTS =====
  {
    id: 30,
    name: 'Brit Premium dla psów',
    description: 'Karma sucha dla psów 15kg',
    brand: 'Brit',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 129.99 },
      { store_name: 'Kakadu', price: 134.99 },
      { store_name: 'PetSmile', price: 127.99 },
      { store_name: 'Zooplus.pl', price: 124.99 }
    ]
  },

  // ===== BOOKS & STATIONERY =====
  {
    id: 31,
    name: 'Notatnik A5',
    description: 'Notatnik w linie 200 stron',
    brand: 'Oxford',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 19.99 },
      { store_name: 'Matras', price: 17.99 },
      { store_name: 'Świat Książki', price: 18.49 }
    ]
  },

  // ===== FURNITURE =====
  {
    id: 32,
    name: 'Świeca zapachowa',
    description: 'Świeca sojowa waniliowa 200g',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 12.99 },
      { store_name: 'Jysk', price: 14.99 },
      { store_name: 'Agata', price: 16.99 }
    ]
  },

  // ===== ALTERNATIVE STORES =====
  {
    id: 33,
    name: 'Mini lampka LED',
    description: 'Lampka biurkowa LED z USB',
    brand: 'Flying Tiger',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Flying Tiger', price: 25.99 },
      { store_name: 'Action', price: 19.99 },
      { store_name: 'TEDi', price: 22.99 }
    ]
  },

  // ===== PREMIUM PRODUCTS =====
  {
    id: 34,
    name: 'Oliwa extra virgin',
    description: 'Oliwa z oliwek extra virgin 500ml',
    brand: 'Monini',
    category_id: 28,
    category_name: 'Premium',
    category_icon: '💎',
    prices: [
      { store_name: 'Delikatesy Centrum', price: 24.99 },
      { store_name: 'Frisco.pl', price: 22.99 },
      { store_name: 'Carrefour', price: 26.99 }
    ]
  },

  // ===== FROZEN FOODS =====
  {
    id: 35,
    name: 'Pizza mrożona',
    description: 'Pizza Margherita mrożona 320g',
    brand: 'Dr. Oetker',
    category_id: 9,
    category_name: 'Mrożonki',
    category_icon: '🧊',
    prices: [
      { store_name: 'Biedronka', price: 7.99 },
      { store_name: 'LIDL', price: 7.49 },
      { store_name: 'Carrefour', price: 8.49 },
      { store_name: 'Auchan', price: 8.19 }
    ]
  },

  // ===== ORGANIC PRODUCTS =====
  {
    id: 36,
    name: 'Mleko owsiane BIO',
    description: 'Napój owsiany ekologiczny 1L',
    brand: 'Alpro',
    category_id: 10,
    category_name: 'Bio/Organiczne',
    category_icon: '🌱',
    prices: [
      { store_name: 'LIDL', price: 4.99 },
      { store_name: 'Carrefour', price: 5.49 },
      { store_name: 'Frisco.pl', price: 4.79 },
      { store_name: 'Aldi', price: 4.69 }
    ]
  },

  // ===== ADDITIONAL BREAD PRODUCTS =====
  {
    id: 37,
    name: 'Chleb graham',
    description: 'Chleb graham pełnoziarnisty 400g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Carrefour', price: 3.79 }
    ]
  },
  {
    id: 38,
    name: 'Bułka hamburgerowa',
    description: 'Bułka do hamburgerów 4 sztuki',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Żabka', price: 3.49 }
    ]
  },
  {
    id: 39,
    name: 'Chleb tostowy',
    description: 'Chleb tostowy biały 500g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 2.49 },
      { store_name: 'LIDL', price: 2.29 },
      { store_name: 'Carrefour', price: 2.69 }
    ]
  },
  {
    id: 40,
    name: 'Rogalik',
    description: 'Rogalik maślany 6 sztuk',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 3.99 },
      { store_name: 'LIDL', price: 3.69 },
      { store_name: 'Żabka', price: 4.49 }
    ]
  },

  // ===== ADDITIONAL DAIRY PRODUCTS =====
  {
    id: 41,
    name: 'Ser żółty gouda',
    description: 'Ser gouda plastry 150g',
    brand: 'Hochland',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.79 },
      { store_name: 'Carrefour', price: 5.29 }
    ]
  },
  {
    id: 42,
    name: 'Twaróg półtłusty',
    description: 'Twaróg półtłusty 250g',
    brand: 'Piątnica',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Dino', price: 3.59 }
    ]
  },
  {
    id: 43,
    name: 'Masło',
    description: 'Masło ekstra 200g',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 5.99 },
      { store_name: 'LIDL', price: 5.79 },
      { store_name: 'Carrefour', price: 6.29 }
    ]
  },
  {
    id: 44,
    name: 'Kefir',
    description: 'Kefir naturalny 400ml',
    brand: 'Bakoma',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Żabka', price: 3.29 }
    ]
  },

  // ===== MEAT PRODUCTS =====
  {
    id: 45,
    name: 'Kiełbasa krakowska',
    description: 'Kiełbasa krakowska sucha 200g',
    brand: 'Sokołów',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Biedronka', price: 7.99 },
      { store_name: 'Dino', price: 8.49 },
      { store_name: 'Carrefour', price: 8.99 }
    ]
  },
  {
    id: 46,
    name: 'Łosoś wędzony',
    description: 'Łosoś wędzony plastry 100g',
    brand: 'Graal',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Carrefour', price: 12.99 },
      { store_name: 'Auchan', price: 12.49 },
      { store_name: 'Delikatesy Centrum', price: 14.99 }
    ]
  },
  {
    id: 47,
    name: 'Schab wieprzowy',
    description: 'Schab wieprzowy bez kości 1kg',
    brand: 'Świeże',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Biedronka', price: 15.99 },
      { store_name: 'LIDL', price: 15.49 },
      { store_name: 'Dino', price: 16.49 }
    ]
  },

  // ===== VEGETABLES =====
  {
    id: 48,
    name: 'Pomidory',
    description: 'Pomidory świeże 1kg',
    brand: 'Polskie',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥕',
    prices: [
      { store_name: 'Biedronka', price: 5.99 },
      { store_name: 'LIDL', price: 5.79 },
      { store_name: 'Carrefour', price: 6.29 }
    ]
  },
  {
    id: 49,
    name: 'Cebula',
    description: 'Cebula żółta 2kg',
    brand: 'Polskie',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥕',
    prices: [
      { store_name: 'Biedronka', price: 3.99 },
      { store_name: 'LIDL', price: 3.79 },
      { store_name: 'Dino', price: 4.19 }
    ]
  },
  {
    id: 50,
    name: 'Marchew',
    description: 'Marchew świeża 1kg',
    brand: 'Polskie',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥕',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Carrefour', price: 3.19 }
    ]
  },

  // ===== FRUITS =====
  {
    id: 51,
    name: 'Jabłka',
    description: 'Jabłka polskie 2kg',
    brand: 'Polskie',
    category_id: 5,
    category_name: 'Owoce',
    category_icon: '🍎',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.79 },
      { store_name: 'Carrefour', price: 5.29 }
    ]
  },
  {
    id: 52,
    name: 'Pomarańcze',
    description: 'Pomarańcze świeże 2kg',
    brand: 'Importowane',
    category_id: 5,
    category_name: 'Owoce',
    category_icon: '🍎',
    prices: [
      { store_name: 'Biedronka', price: 7.99 },
      { store_name: 'LIDL', price: 7.69 },
      { store_name: 'Carrefour', price: 8.49 }
    ]
  },
  {
    id: 53,
    name: 'Banany',
    description: 'Banany świeże 1kg',
    brand: 'Chiquita',
    category_id: 5,
    category_name: 'Owoce',
    category_icon: '🍎',
    prices: [
      { store_name: 'Biedronka', price: 3.99 },
      { store_name: 'LIDL', price: 3.79 },
      { store_name: 'Żabka', price: 4.49 }
    ]
  },

  // ===== BEVERAGES =====
  {
    id: 54,
    name: 'Woda mineralna',
    description: 'Woda mineralna niegazowana 1.5L',
    brand: 'Żywiec Zdrój',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Biedronka', price: 1.99 },
      { store_name: 'LIDL', price: 1.89 },
      { store_name: 'Żabka', price: 2.49 }
    ]
  },
  {
    id: 55,
    name: 'Coca Cola',
    description: 'Coca Cola 2L',
    brand: 'Coca Cola',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.79 },
      { store_name: 'Żabka', price: 5.49 }
    ]
  },
  {
    id: 56,
    name: 'Kawa mielona',
    description: 'Kawa mielona 500g',
    brand: 'Jacobs',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Biedronka', price: 12.99 },
      { store_name: 'LIDL', price: 12.49 },
      { store_name: 'Carrefour', price: 13.99 }
    ]
  },

  // ===== SNACKS =====
  {
    id: 57,
    name: 'Chipsy ziemniaczane',
    description: 'Chipsy o smaku paprykowym 150g',
    brand: 'Lay\'s',
    category_id: 8,
    category_name: 'Przekąski',
    category_icon: '🍿',
    prices: [
      { store_name: 'Biedronka', price: 3.99 },
      { store_name: 'LIDL', price: 3.79 },
      { store_name: 'Żabka', price: 4.49 }
    ]
  },
  {
    id: 58,
    name: 'Orzeszki ziemne',
    description: 'Orzeszki ziemne solone 200g',
    brand: 'Frito Lay',
    category_id: 8,
    category_name: 'Przekąski',
    category_icon: '🍿',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.69 },
      { store_name: 'Żabka', price: 5.49 }
    ]
  },

  // ===== SWEETS =====
  {
    id: 59,
    name: 'Czekolada mleczna',
    description: 'Czekolada mleczna 100g',
    brand: 'Milka',
    category_id: 7,
    category_name: 'Słodycze',
    category_icon: '🍭',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Żabka', price: 3.99 }
    ]
  },
  {
    id: 60,
    name: 'Cukierki żelowe',
    description: 'Cukierki żelowe owocowe 200g',
    brand: 'Haribo',
    category_id: 7,
    category_name: 'Słodycze',
    category_icon: '🍭',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.69 },
      { store_name: 'Żabka', price: 5.49 }
    ]
  },

  // ===== ELECTRONICS - Media Markt, Saturn, RTV Euro AGD =====
  {
    id: 61,
    name: 'iPhone 15',
    description: 'Apple iPhone 15 128GB',
    brand: 'Apple',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 3799.99 },
      { store_name: 'Saturn', price: 3799.99 },
      { store_name: 'RTV Euro AGD', price: 3849.99 }
    ]
  },
  {
    id: 62,
    name: 'Samsung Galaxy S24',
    description: 'Samsung Galaxy S24 256GB',
    brand: 'Samsung',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 3499.99 },
      { store_name: 'Saturn', price: 3499.99 },
      { store_name: 'Neonet', price: 3549.99 }
    ]
  },
  {
    id: 63,
    name: 'Laptop Dell',
    description: 'Dell Inspiron 15 Intel i5',
    brand: 'Dell',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 2299.99 },
      { store_name: 'RTV Euro AGD', price: 2349.99 },
      { store_name: 'Neonet', price: 2279.99 }
    ]
  },
  {
    id: 64,
    name: 'Telewizor Samsung 55"',
    description: 'Samsung 55" 4K Smart TV',
    brand: 'Samsung',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 1999.99 },
      { store_name: 'Saturn', price: 1999.99 },
      { store_name: 'RTV Euro AGD', price: 2049.99 }
    ]
  },
  {
    id: 65,
    name: 'PlayStation 5',
    description: 'Sony PlayStation 5 konsola',
    brand: 'Sony',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 2399.99 },
      { store_name: 'Saturn', price: 2399.99 },
      { store_name: 'Empik', price: 2449.99 }
    ]
  },

  // ===== COSMETICS - Rossmann, Hebe, Super-Pharm =====
  {
    id: 66,
    name: 'Krem przeciwzmarszczkowy',
    description: 'Krem przeciwzmarszczkowy L\'Oreal 50ml',
    brand: 'L\'Oreal',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 34.99 },
      { store_name: 'Hebe', price: 39.99 },
      { store_name: 'Super-Pharm', price: 37.99 }
    ]
  },
  {
    id: 67,
    name: 'Szminka Maybelline',
    description: 'Szminka matowa Maybelline',
    brand: 'Maybelline',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 19.99 },
      { store_name: 'Hebe', price: 22.99 },
      { store_name: 'Super-Pharm', price: 21.99 }
    ]
  },
  {
    id: 68,
    name: 'Perfumy Hugo Boss',
    description: 'Hugo Boss perfumy męskie 100ml',
    brand: 'Hugo Boss',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Hebe', price: 189.99 },
      { store_name: 'Super-Pharm', price: 199.99 },
      { store_name: 'Douglas', price: 179.99 }
    ]
  },
  {
    id: 69,
    name: 'Szampon Pantene',
    description: 'Szampon wzmacniający 400ml',
    brand: 'Pantene',
    category_id: 12,
    category_name: 'Higiena',
    category_icon: '🧼',
    prices: [
      { store_name: 'Rossmann', price: 12.99 },
      { store_name: 'Hebe', price: 14.99 },
      { store_name: 'Biedronka', price: 13.49 }
    ]
  },
  {
    id: 70,
    name: 'Pasta do zębów Colgate',
    description: 'Pasta do zębów Colgate 100ml',
    brand: 'Colgate',
    category_id: 12,
    category_name: 'Higiena',
    category_icon: '🧼',
    prices: [
      { store_name: 'Rossmann', price: 8.99 },
      { store_name: 'Biedronka', price: 9.49 },
      { store_name: 'LIDL', price: 8.79 }
    ]
  },

  // ===== FURNITURE - IKEA, Jysk, Agata =====
  {
    id: 71,
    name: 'Fotel biurowy',
    description: 'Fotel biurowy ergonomiczny',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 299.99 }
    ]
  },
  {
    id: 72,
    name: 'Łóżko drewniane',
    description: 'Łóżko drewniane 140x200cm',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'Jysk', price: 899.99 },
      { store_name: 'Agata', price: 949.99 },
      { store_name: 'Black Red White', price: 1099.99 }
    ]
  },
  {
    id: 73,
    name: 'Szafa trzydrzwiowa',
    description: 'Szafa 3-drzwiowa z lustrem',
    brand: 'Agata',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'Agata', price: 1299.99 },
      { store_name: 'Jysk', price: 1199.99 },
      { store_name: 'IKEA', price: 999.99 }
    ]
  },
  {
    id: 74,
    name: 'Stół kuchenny',
    description: 'Stół kuchenny rozkładany',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 399.99 },
      { store_name: 'Jysk', price: 449.99 },
      { store_name: 'Agata', price: 499.99 }
    ]
  },
  {
    id: 75,
    name: 'Komoda 4-szufladowa',
    description: 'Komoda z 4 szufladami',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'Jysk', price: 299.99 },
      { store_name: 'IKEA', price: 249.99 },
      { store_name: 'Agata', price: 349.99 }
    ]
  },

  // ===== TOOLS & DIY - Leroy Merlin, Castorama, OBI =====
  {
    id: 76,
    name: 'Wiertarka Bosch',
    description: 'Wiertarka udarowa Bosch 18V',
    brand: 'Bosch',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 299.99 },
      { store_name: 'Castorama', price: 309.99 },
      { store_name: 'OBI', price: 294.99 }
    ]
  },
  {
    id: 77,
    name: 'Zestaw kluczy',
    description: 'Zestaw kluczy nasadowych 108 elem.',
    brand: 'Stanley',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 189.99 },
      { store_name: 'Castorama', price: 199.99 },
      { store_name: 'PSB Mrówka', price: 179.99 }
    ]
  },
  {
    id: 78,
    name: 'Farba ścienna',
    description: 'Farba lateksowa biała 10L',
    brand: 'Śnieżka',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 129.99 },
      { store_name: 'Castorama', price: 134.99 },
      { store_name: 'OBI', price: 124.99 }
    ]
  },
  {
    id: 79,
    name: 'Płytki ceramiczne',
    description: 'Płytki podłogowe 60x60cm',
    brand: 'Cersanit',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 24.99 },
      { store_name: 'Castorama', price: 26.99 },
      { store_name: 'OBI', price: 23.99 }
    ]
  },
  {
    id: 80,
    name: 'Młotek',
    description: 'Młotek stolarski 500g',
    brand: 'Stanley',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 39.99 },
      { store_name: 'Castorama', price: 42.99 },
      { store_name: 'PSB Mrówka', price: 37.99 }
    ]
  },

  // ===== ELECTRONICS EXPANSION (80+ products) =====
  {
    id: 81,
    name: 'MacBook Air',
    description: 'Apple MacBook Air M2 256GB',
    brand: 'Apple',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 5299.99 },
      { store_name: 'Saturn', price: 5299.99 },
      { store_name: 'RTV Euro AGD', price: 5399.99 }
    ]
  },
  {
    id: 82,
    name: 'iPad Pro',
    description: 'Apple iPad Pro 11" 128GB',
    brand: 'Apple',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 3999.99 },
      { store_name: 'Saturn', price: 3999.99 },
      { store_name: 'Empik', price: 4099.99 }
    ]
  },
  {
    id: 83,
    name: 'Nintendo Switch',
    description: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 1499.99 },
      { store_name: 'Saturn', price: 1499.99 },
      { store_name: 'Empik', price: 1549.99 }
    ]
  },
  {
    id: 84,
    name: 'AirPods Pro',
    description: 'Apple AirPods Pro 2. generacji',
    brand: 'Apple',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 1199.99 },
      { store_name: 'Saturn', price: 1199.99 },
      { store_name: 'RTV Euro AGD', price: 1249.99 }
    ]
  },
  {
    id: 85,
    name: 'Kamera Canon',
    description: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 8999.99 },
      { store_name: 'Saturn', price: 8999.99 },
      { store_name: 'RTV Euro AGD', price: 9199.99 }
    ]
  },

  // ===== COSMETICS & HEALTH EXPANSION =====
  {
    id: 86,
    name: 'Serum witamina C',
    description: 'Serum z witaminą C 30ml',
    brand: 'The Ordinary',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Hebe', price: 34.99 },
      { store_name: 'Super-Pharm', price: 37.99 },
      { store_name: 'Douglas', price: 32.99 }
    ]
  },
  {
    id: 87,
    name: 'Krem pod oczy',
    description: 'Krem przeciwzmarszczkowy pod oczy',
    brand: 'Olay',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 29.99 },
      { store_name: 'Hebe', price: 32.99 },
      { store_name: 'Super-Pharm', price: 31.99 }
    ]
  },
  {
    id: 88,
    name: 'Mleczko oczyszczające',
    description: 'Mleczko do demakijażu 200ml',
    brand: 'Garnier',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 15.99 },
      { store_name: 'Hebe', price: 17.99 },
      { store_name: 'Biedronka', price: 16.49 }
    ]
  },
  {
    id: 89,
    name: 'Maska do twarzy',
    description: 'Maska nawilżająca z kwasem hialuronowym',
    brand: 'Garnier',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 8.99 },
      { store_name: 'Hebe', price: 9.99 },
      { store_name: 'LIDL', price: 7.99 }
    ]
  },
  {
    id: 90,
    name: 'Dezodorant',
    description: 'Dezodorant w sprayu 150ml',
    brand: 'Rexona',
    category_id: 12,
    category_name: 'Higiena',
    category_icon: '🧼',
    prices: [
      { store_name: 'Rossmann', price: 6.99 },
      { store_name: 'Biedronka', price: 7.49 },
      { store_name: 'LIDL', price: 6.79 }
    ]
  },

  // ===== FURNITURE & HOME EXPANSION =====
  {
    id: 91,
    name: 'Kanapa 3-osobowa',
    description: 'Kanapa rozkładana z funkcją spania',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 1299.99 },
      { store_name: 'Jysk', price: 1399.99 },
      { store_name: 'Agata', price: 1499.99 }
    ]
  },
  {
    id: 92,
    name: 'Materac',
    description: 'Materac piankowy 160x200cm',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'Jysk', price: 699.99 },
      { store_name: 'IKEA', price: 599.99 },
      { store_name: 'Agata', price: 799.99 }
    ]
  },
  {
    id: 93,
    name: 'Lustro łazienkowe',
    description: 'Lustro z oświetleniem LED',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 199.99 },
      { store_name: 'Jysk', price: 249.99 },
      { store_name: 'Leroy Merlin', price: 179.99 }
    ]
  },
  {
    id: 94,
    name: 'Regał książkowy',
    description: 'Regał 5-półkowy z drewna',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 249.99 },
      { store_name: 'Jysk', price: 299.99 },
      { store_name: 'Agata', price: 349.99 }
    ]
  },
  {
    id: 95,
    name: 'Krzesło biurowe',
    description: 'Krzesło obrotowe z podłokietnikami',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'Jysk', price: 399.99 },
      { store_name: 'IKEA', price: 349.99 },
      { store_name: 'Agata', price: 449.99 }
    ]
  },

  // ===== SPORTS & FITNESS EXPANSION =====
  {
    id: 96,
    name: 'Mata do jogi',
    description: 'Mata do ćwiczeń 6mm',
    brand: 'Domyos',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 29.99 },
      { store_name: 'Go Sport', price: 34.99 }
    ]
  },
  {
    id: 97,
    name: 'Hantle',
    description: 'Zestaw hantli 2x5kg',
    brand: 'Domyos',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 89.99 },
      { store_name: 'Go Sport', price: 99.99 }
    ]
  },
  {
    id: 98,
    name: 'Rower szosowy',
    description: 'Rower szosowy 28" dla dorosłych',
    brand: 'Btwin',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 1299.99 },
      { store_name: 'Go Sport', price: 1399.99 }
    ]
  },
  {
    id: 99,
    name: 'Buty do biegania',
    description: 'Buty sportowe do biegania',
    brand: 'Nike',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 299.99 },
      { store_name: 'Go Sport', price: 319.99 },
      { store_name: 'CCC', price: 289.99 }
    ]
  },
  {
    id: 100,
    name: 'Strój kąpielowy',
    description: 'Kostium kąpielowy damski',
    brand: 'Nabaiji',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 49.99 },
      { store_name: 'Go Sport', price: 54.99 }
    ]
  },

  // ===== PET PRODUCTS EXPANSION =====
  {
    id: 101,
    name: 'Karma dla kotów',
    description: 'Karma sucha dla kotów dorosłych 10kg',
    brand: 'Royal Canin',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 189.99 },
      { store_name: 'Kakadu', price: 194.99 },
      { store_name: 'PetSmile', price: 187.99 }
    ]
  },
  {
    id: 102,
    name: 'Żwirek dla kotów',
    description: 'Żwirek zbrylający 10L',
    brand: 'Catsan',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 24.99 },
      { store_name: 'Kakadu', price: 26.99 },
      { store_name: 'PetSmile', price: 23.99 }
    ]
  },
  {
    id: 103,
    name: 'Smycz dla psa',
    description: 'Smycz regulowana 120cm',
    brand: 'Ferplast',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 29.99 },
      { store_name: 'Kakadu', price: 32.99 },
      { store_name: 'PetSmile', price: 27.99 }
    ]
  },
  {
    id: 104,
    name: 'Klatka dla ptaków',
    description: 'Klatka dla papużek 40x40x60cm',
    brand: 'Ferplast',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Kakadu', price: 149.99 },
      { store_name: 'Maxi Zoo', price: 159.99 },
      { store_name: 'PetSmile', price: 144.99 }
    ]
  },
  {
    id: 105,
    name: 'Karma dla gryzoni',
    description: 'Karma dla królików i świnek 1kg',
    brand: 'Vitapol',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 12.99 },
      { store_name: 'Kakadu', price: 14.99 },
      { store_name: 'PetSmile', price: 11.99 }
    ]
  },

  // ===== TOOLS & DIY EXPANSION =====
  {
    id: 106,
    name: 'Piła tarczowa',
    description: 'Piła tarczowa 1400W',
    brand: 'Bosch',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 399.99 },
      { store_name: 'Castorama', price: 419.99 },
      { store_name: 'OBI', price: 389.99 }
    ]
  },
  {
    id: 107,
    name: 'Śrubokręt elektryczny',
    description: 'Wkrętak akumulatorowy 12V',
    brand: 'Makita',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 199.99 },
      { store_name: 'Castorama', price: 209.99 },
      { store_name: 'PSB Mrówka', price: 189.99 }
    ]
  },
  {
    id: 108,
    name: 'Drabina aluminiowa',
    description: 'Drabina 3-członowa 3x10 stopni',
    brand: 'Krause',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 599.99 },
      { store_name: 'Castorama', price: 629.99 },
      { store_name: 'OBI', price: 579.99 }
    ]
  },
  {
    id: 109,
    name: 'Taśma malarska',
    description: 'Taśma malarska 50mm x 50m',
    brand: 'Tesa',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 12.99 },
      { store_name: 'Castorama', price: 13.99 },
      { store_name: 'OBI', price: 11.99 }
    ]
  },
  {
    id: 110,
    name: 'Gwoździe',
    description: 'Gwoździe budowlane 50mm 1kg',
    brand: 'Fischer',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 8.99 },
      { store_name: 'Castorama', price: 9.49 },
      { store_name: 'PSB Mrówka', price: 7.99 }
    ]
  },

  // ===== BOOKS & STATIONERY EXPANSION =====
  {
    id: 111,
    name: 'Długopis żelowy',
    description: 'Długopis żelowy czarny 12 sztuk',
    brand: 'Pilot',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 24.99 },
      { store_name: 'Świat Książki', price: 22.99 },
      { store_name: 'Matras', price: 21.99 }
    ]
  },
  {
    id: 112,
    name: 'Zeszyt szkolny',
    description: 'Zeszyt A5 w kratkę 60 kartek',
    brand: 'Oxford',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 3.99 },
      { store_name: 'Matras', price: 3.49 },
      { store_name: 'Biedronka', price: 2.99 }
    ]
  },
  {
    id: 113,
    name: 'Książka kucharska',
    description: 'Przepisy polskiej kuchni',
    brand: 'Wydawnictwo RM',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 39.99 },
      { store_name: 'Świat Książki', price: 37.99 },
      { store_name: 'Matras', price: 35.99 }
    ]
  },
  {
    id: 114,
    name: 'Kredki ołówkowe',
    description: 'Kredki ołówkowe 24 kolory',
    brand: 'Faber-Castell',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 19.99 },
      { store_name: 'Matras', price: 17.99 },
      { store_name: 'LIDL', price: 15.99 }
    ]
  },
  {
    id: 115,
    name: 'Atlas świata',
    description: 'Atlas geograficzny świata',
    brand: 'Demart',
    category_id: 18,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 49.99 },
      { store_name: 'Świat Książki', price: 47.99 },
      { store_name: 'Matras', price: 45.99 }
    ]
  },

  // ===== CONVENIENCE STORE EXPANSION (Petrol stations) =====
  {
    id: 116,
    name: 'Kawa na wynos',
    description: 'Kawa latte 300ml',
    brand: 'Orlen Stop',
    category_id: 29,
    category_name: 'Convenience',
    category_icon: '🏪',
    prices: [
      { store_name: 'Orlen', price: 8.99 },
      { store_name: 'Circle K', price: 9.49 },
      { store_name: 'Shell', price: 8.79 }
    ]
  },
  {
    id: 117,
    name: 'Kanapka świeża',
    description: 'Kanapka z szynką i serem',
    brand: 'Fresh',
    category_id: 29,
    category_name: 'Convenience',
    category_icon: '🏪',
    prices: [
      { store_name: 'Orlen', price: 7.99 },
      { store_name: 'Circle K', price: 8.49 },
      { store_name: 'BP', price: 7.69 }
    ]
  },
  {
    id: 118,
    name: 'Płyn do spryskiwaczy',
    description: 'Płyn do spryskiwaczy -20°C 5L',
    brand: 'Orlen Oil',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '🛢️',
    prices: [
      { store_name: 'Orlen', price: 19.99 },
      { store_name: 'BP', price: 21.99 },
      { store_name: 'Shell', price: 20.49 }
    ]
  },
  {
    id: 119,
    name: 'Ładowarka samochodowa',
    description: 'Ładowarka USB 12V do samochodu',
    brand: 'Hama',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '🛢️',
    prices: [
      { store_name: 'Orlen', price: 24.99 },
      { store_name: 'Circle K', price: 26.99 },
      { store_name: 'Shell', price: 23.99 }
    ]
  },
  {
    id: 120,
    name: 'Napój energetyczny',
    description: 'Monster Energy 500ml',
    brand: 'Monster',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Orlen', price: 7.99 },
      { store_name: 'Circle K', price: 8.49 },
      { store_name: 'Żabka', price: 8.99 }
    ]
  },

  // ===== ETHNIC FOOD EXPANSION =====
  // Turkish Products
  {
    id: 121,
    name: 'Bulgur',
    description: 'Bulgur turecki 1kg',
    brand: 'Duru',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Turecki', price: 8.99 }
    ]
  },
  {
    id: 122,
    name: 'Oliwki tureckie',
    description: 'Oliwki czarne w oleju 400g',
    brand: 'Sera',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Turecki', price: 12.99 }
    ]
  },
  {
    id: 123,
    name: 'Baklava',
    description: 'Baklava z pistacjami 250g',
    brand: 'Koska',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Turecki', price: 24.99 }
    ]
  },
  // Vietnamese Products
  {
    id: 124,
    name: 'Sos rybny',
    description: 'Wietnamski sos rybny 500ml',
    brand: 'Red Boat',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Vietnam Market', price: 18.99 }
    ]
  },
  {
    id: 125,
    name: 'Mleko kokosowe',
    description: 'Mleko kokosowe 400ml',
    brand: 'Aroy-D',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Vietnam Market', price: 6.99 }
    ]
  },
  // Indian Products
  {
    id: 126,
    name: 'Curry w proszku',
    description: 'Mieszanka przypraw curry 100g',
    brand: 'Shan',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Indyjski', price: 8.99 }
    ]
  },
  {
    id: 127,
    name: 'Ryż basmati',
    description: 'Ryż basmati 1kg',
    brand: 'Tilda',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Sklep Indyjski', price: 14.99 }
    ]
  },
  // Ukrainian Products
  {
    id: 128,
    name: 'Barszcz ukraiński',
    description: 'Koncentrat barszczu czerwonego 350ml',
    brand: 'Tradycja',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Ukraiński Market', price: 9.99 }
    ]
  },
  {
    id: 129,
    name: 'Pierogi ukraińskie',
    description: 'Pierogi z kapustą 500g mrożone',
    brand: 'Babcia',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Ukraiński Market', price: 12.99 }
    ]
  },
  {
    id: 130,
    name: 'Miód gryczany',
    description: 'Naturalny miód gryczany 500g',
    brand: 'Paseka',
    category_id: 27,
    category_name: 'Kuchnie świata',
    category_icon: '🌍',
    prices: [
      { store_name: 'Ukraiński Market', price: 19.99 }
    ]
  },

  // ===== ALCOHOL EXPANSION =====
  {
    id: 131,
    name: 'Wino czerwone',
    description: 'Wino czerwone wytrawne 750ml',
    brand: 'Winnica Turnau',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Carrefour', price: 24.99 },
      { store_name: 'Auchan', price: 23.99 },
      { store_name: 'Tesco', price: 25.49 }
    ]
  },
  {
    id: 132,
    name: 'Whisky',
    description: 'Whisky szkocka 700ml',
    brand: 'Johnnie Walker',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Carrefour', price: 89.99 },
      { store_name: 'Auchan', price: 87.99 },
      { store_name: 'Delikatesy Centrum', price: 94.99 }
    ]
  },
  {
    id: 133,
    name: 'Szampan',
    description: 'Szampan francuski 750ml',
    brand: 'Moet & Chandon',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Delikatesy Centrum', price: 249.99 },
      { store_name: 'Carrefour', price: 239.99 },
      { store_name: 'Auchan', price: 244.99 }
    ]
  },
  {
    id: 134,
    name: 'Piwo kraftowe',
    description: 'Piwo rzemieślnicze IPA 500ml',
    brand: 'Browar Stu Mostów',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Carrefour', price: 8.99 },
      { store_name: 'Delikatesy Centrum', price: 9.99 },
      { store_name: 'LIDL', price: 7.99 }
    ]
  },
  {
    id: 135,
    name: 'Gin',
    description: 'Gin premium 700ml',
    brand: 'Hendricks',
    category_id: 26,
    category_name: 'Alkohol',
    category_icon: '🍷',
    prices: [
      { store_name: 'Carrefour', price: 129.99 },
      { store_name: 'Auchan', price: 124.99 },
      { store_name: 'Delikatesy Centrum', price: 134.99 }
    ]
  },

  // ===== IKEA FOOD EXPANSION =====
  {
    id: 136,
    name: 'Sos śmietankowy',
    description: 'Sos śmietankowy do klopsików 500ml',
    brand: 'IKEA',
    category_id: 9,
    category_name: 'Mrożonki',
    category_icon: '🧊',
    prices: [
      { store_name: 'IKEA', price: 9.99 }
    ]
  },
  {
    id: 137,
    name: 'Łosoś wędzony',
    description: 'Szwedzki łosoś wędzony 200g',
    brand: 'IKEA',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'IKEA', price: 19.99 }
    ]
  },
  {
    id: 138,
    name: 'Ciastka owsiane',
    description: 'Ciastka owsiane z czekoladą 200g',
    brand: 'IKEA',
    category_id: 7,
    category_name: 'Słodycze',
    category_icon: '🍭',
    prices: [
      { store_name: 'IKEA', price: 6.99 }
    ]
  },
  {
    id: 139,
    name: 'Herbata ziołowa',
    description: 'Herbata ziołowa mix szwedzki 20 torebek',
    brand: 'IKEA',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'IKEA', price: 12.99 }
    ]
  },
  {
    id: 140,
    name: 'Mieszanka do pieczenia',
    description: 'Mieszanka do chleba 750g',
    brand: 'IKEA',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'IKEA', price: 8.99 }
    ]
  },

  // ===== ELECTRONICS CATEGORY - 10 products for Media Markt, Saturn, RTV Euro AGD, Neonet =====
  {
    id: 141,
    name: 'Gaming Klawiatura',
    description: 'Mechaniczna klawiatura gamingowa RGB',
    brand: 'Logitech',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 299.99 },
      { store_name: 'Saturn', price: 289.99 },
      { store_name: 'RTV Euro AGD', price: 309.99 },
      { store_name: 'Neonet', price: 295.99 }
    ]
  },
  {
    id: 142,
    name: 'Gaming Mysz',
    description: 'Mysz optyczna dla graczy',
    brand: 'Razer',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 199.99 },
      { store_name: 'Saturn', price: 189.99 },
      { store_name: 'RTV Euro AGD', price: 209.99 },
      { store_name: 'Neonet', price: 195.99 }
    ]
  },
  {
    id: 143,
    name: 'Monitor 27"',
    description: 'Monitor gamingowy 27" 144Hz',
    brand: 'ASUS',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 1299.99 },
      { store_name: 'Saturn', price: 1279.99 },
      { store_name: 'RTV Euro AGD', price: 1349.99 },
      { store_name: 'Neonet', price: 1259.99 }
    ]
  },
  {
    id: 144,
    name: 'Kable HDMI',
    description: 'Kabel HDMI 2.1 4K 2m',
    brand: 'Belkin',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 89.99 },
      { store_name: 'Saturn', price: 84.99 },
      { store_name: 'RTV Euro AGD', price: 94.99 },
      { store_name: 'Neonet', price: 79.99 }
    ]
  },
  {
    id: 145,
    name: 'Webcam HD',
    description: 'Kamera internetowa 1080p',
    brand: 'Logitech',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 249.99 },
      { store_name: 'Saturn', price: 239.99 },
      { store_name: 'RTV Euro AGD', price: 259.99 },
      { store_name: 'Neonet', price: 229.99 }
    ]
  },
  {
    id: 146,
    name: 'Głośniki bezprzewodowe',
    description: 'Głośniki Bluetooth wodoodporne',
    brand: 'JBL',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 399.99 },
      { store_name: 'Saturn', price: 389.99 },
      { store_name: 'RTV Euro AGD', price: 419.99 },
      { store_name: 'Neonet', price: 379.99 }
    ]
  },
  {
    id: 147,
    name: 'Dysk SSD',
    description: 'Dysk SSD 1TB NVME',
    brand: 'Samsung',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 499.99 },
      { store_name: 'Saturn', price: 479.99 },
      { store_name: 'RTV Euro AGD', price: 519.99 },
      { store_name: 'Neonet', price: 459.99 }
    ]
  },
  {
    id: 148,
    name: 'Router WiFi',
    description: 'Router WiFi 6 AX1800',
    brand: 'TP-Link',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 299.99 },
      { store_name: 'Saturn', price: 289.99 },
      { store_name: 'RTV Euro AGD', price: 319.99 },
      { store_name: 'Neonet', price: 279.99 }
    ]
  },
  {
    id: 149,
    name: 'Mikrofon USB',
    description: 'Mikrofon pojemnościowy USB',
    brand: 'Blue Yeti',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 599.99 },
      { store_name: 'Saturn', price: 579.99 },
      { store_name: 'RTV Euro AGD', price: 629.99 },
      { store_name: 'Neonet', price: 559.99 }
    ]
  },
  {
    id: 150,
    name: 'Pendrive 128GB',
    description: 'Pendrive USB 3.0 128GB',
    brand: 'SanDisk',
    category_id: 16,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 79.99 },
      { store_name: 'Saturn', price: 74.99 },
      { store_name: 'RTV Euro AGD', price: 84.99 },
      { store_name: 'Neonet', price: 69.99 }
    ]
  },

  // ===== PET STORES CATEGORY - 10 products for Maxi Zoo, Kakadu, PetSmile, Zooplus.pl =====
  {
    id: 151,
    name: 'Karma dla ryb',
    description: 'Pokarm dla ryb akwariowych 100g',
    brand: 'Tetra',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 15.99 },
      { store_name: 'Kakadu', price: 17.99 },
      { store_name: 'PetSmile', price: 14.99 },
      { store_name: 'Zooplus.pl', price: 13.99 }
    ]
  },
  {
    id: 152,
    name: 'Obroża dla psa',
    description: 'Obroża skórzana regulowana',
    brand: 'Hunter',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 49.99 },
      { store_name: 'Kakadu', price: 54.99 },
      { store_name: 'PetSmile', price: 47.99 },
      { store_name: 'Zooplus.pl', price: 44.99 }
    ]
  },
  {
    id: 153,
    name: 'Zabawka dla kota',
    description: 'Piłka z piórkami dla kotów',
    brand: 'Kong',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 19.99 },
      { store_name: 'Kakadu', price: 22.99 },
      { store_name: 'PetSmile', price: 18.99 },
      { store_name: 'Zooplus.pl', price: 16.99 }
    ]
  },
  {
    id: 154,
    name: 'Akwarium 60L',
    description: 'Akwarium kompletne z filtrem',
    brand: 'Juwel',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 299.99 },
      { store_name: 'Kakadu', price: 319.99 },
      { store_name: 'PetSmile', price: 289.99 },
      { store_name: 'Zooplus.pl', price: 269.99 }
    ]
  },
  {
    id: 155,
    name: 'Transporter dla kota',
    description: 'Transporter plastikowy dla kotów',
    brand: 'Ferplast',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 89.99 },
      { store_name: 'Kakadu', price: 94.99 },
      { store_name: 'PetSmile', price: 84.99 },
      { store_name: 'Zooplus.pl', price: 79.99 }
    ]
  },
  {
    id: 156,
    name: 'Legowisko dla psa',
    description: 'Poduszka dla średnich psów',
    brand: 'Trixie',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 79.99 },
      { store_name: 'Kakadu', price: 84.99 },
      { store_name: 'PetSmile', price: 74.99 },
      { store_name: 'Zooplus.pl', price: 69.99 }
    ]
  },
  {
    id: 157,
    name: 'Szczotka dla psów',
    description: 'Szczotka do czesania długowłosych psów',
    brand: 'FURminator',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 129.99 },
      { store_name: 'Kakadu', price: 139.99 },
      { store_name: 'PetSmile', price: 124.99 },
      { store_name: 'Zooplus.pl', price: 119.99 }
    ]
  },
  {
    id: 158,
    name: 'Karma dla chomików',
    description: 'Mieszanka dla chomików 500g',
    brand: 'Vitakraft',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 9.99 },
      { store_name: 'Kakadu', price: 11.99 },
      { store_name: 'PetSmile', price: 8.99 },
      { store_name: 'Zooplus.pl', price: 7.99 }
    ]
  },
  {
    id: 159,
    name: 'Szampon dla psów',
    description: 'Szampon dla wrażliwej skóry psów',
    brand: 'Beaphar',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 24.99 },
      { store_name: 'Kakadu', price: 27.99 },
      { store_name: 'PetSmile', price: 22.99 },
      { store_name: 'Zooplus.pl', price: 20.99 }
    ]
  },
  {
    id: 160,
    name: 'Miski dla zwierząt',
    description: 'Zestaw misek stalowych 2 sztuki',
    brand: 'Trixie',
    category_id: 23,
    category_name: 'Zwierzęta',
    category_icon: '🐕',
    prices: [
      { store_name: 'Maxi Zoo', price: 39.99 },
      { store_name: 'Kakadu', price: 44.99 },
      { store_name: 'PetSmile', price: 37.99 },
      { store_name: 'Zooplus.pl', price: 34.99 }
    ]
  },

  // ===== DRUGSTORES CATEGORY - 10 products for Rossmann, Super-Pharm, Hebe, Doz.pl =====
  {
    id: 161,
    name: 'Witaminy C',
    description: 'Tabletki witaminy C 1000mg',
    brand: 'Olimp',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 19.99 },
      { store_name: 'Super-Pharm', price: 22.99 },
      { store_name: 'Hebe', price: 21.99 },
      { store_name: 'Doz.pl', price: 18.99 }
    ]
  },
  {
    id: 162,
    name: 'Termometr cyfrowy',
    description: 'Termometr bezdotykowy',
    brand: 'Braun',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 149.99 },
      { store_name: 'Super-Pharm', price: 159.99 },
      { store_name: 'Hebe', price: 154.99 },
      { store_name: 'Doz.pl', price: 144.99 }
    ]
  },
  {
    id: 163,
    name: 'Środek dezynfekujący',
    description: 'Żel antybakteryjny do rąk 500ml',
    brand: 'Sterillium',
    category_id: 12,
    category_name: 'Higiena',
    category_icon: '🧼',
    prices: [
      { store_name: 'Rossmann', price: 12.99 },
      { store_name: 'Super-Pharm', price: 14.99 },
      { store_name: 'Hebe', price: 13.99 },
      { store_name: 'Doz.pl', price: 11.99 }
    ]
  },
  {
    id: 164,
    name: 'Plastry na rany',
    description: 'Plastry wodoodporne 20 sztuk',
    brand: 'Hansaplast',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 8.99 },
      { store_name: 'Super-Pharm', price: 9.99 },
      { store_name: 'Hebe', price: 9.49 },
      { store_name: 'Doz.pl', price: 7.99 }
    ]
  },
  {
    id: 165,
    name: 'Kremy z filtrem UV',
    description: 'Krem z filtrem SPF 50+ 100ml',
    brand: 'Eucerin',
    category_id: 15,
    category_name: 'Kosmetyki',
    category_icon: '💄',
    prices: [
      { store_name: 'Rossmann', price: 39.99 },
      { store_name: 'Super-Pharm', price: 44.99 },
      { store_name: 'Hebe', price: 42.99 },
      { store_name: 'Doz.pl', price: 37.99 }
    ]
  },
  {
    id: 166,
    name: 'Tabletki na ból głowy',
    description: 'Ibuprofen 400mg 20 tabletek',
    brand: 'Ibuprom',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 9.99 },
      { store_name: 'Super-Pharm', price: 11.99 },
      { store_name: 'Hebe', price: 10.99 },
      { store_name: 'Doz.pl', price: 8.99 }
    ]
  },
  {
    id: 167,
    name: 'Witaminy dla włosów',
    description: 'Biotin forte 60 tabletek',
    brand: 'Solgar',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 89.99 },
      { store_name: 'Super-Pharm', price: 94.99 },
      { store_name: 'Hebe', price: 92.99 },
      { store_name: 'Doz.pl', price: 84.99 }
    ]
  },
  {
    id: 168,
    name: 'Test ciążowy',
    description: 'Test ciążowy cyfrowy',
    brand: 'Clearblue',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 29.99 },
      { store_name: 'Super-Pharm', price: 32.99 },
      { store_name: 'Hebe', price: 31.99 },
      { store_name: 'Doz.pl', price: 27.99 }
    ]
  },
  {
    id: 169,
    name: 'Krople do oczu',
    description: 'Krople nawilżające do oczu 10ml',
    brand: 'Hylak',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 19.99 },
      { store_name: 'Super-Pharm', price: 22.99 },
      { store_name: 'Hebe', price: 21.49 },
      { store_name: 'Doz.pl', price: 18.99 }
    ]
  },
  {
    id: 170,
    name: 'Probiotyki',
    description: 'Probiotyki dla dorosłych 30 kapsułek',
    brand: 'Lactobacillus',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Rossmann', price: 49.99 },
      { store_name: 'Super-Pharm', price: 54.99 },
      { store_name: 'Hebe', price: 52.99 },
      { store_name: 'Doz.pl', price: 46.99 }
    ]
  },

  // ===== DIY/TOOLS CATEGORY - 10 products for Leroy Merlin, Castorama, OBI, PSB Mrówka =====
  {
    id: 171,
    name: 'Śruby do drewna',
    description: 'Śruby do drewna 4x50mm 100 sztuk',
    brand: 'Fischer',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 15.99 },
      { store_name: 'Castorama', price: 16.99 },
      { store_name: 'OBI', price: 14.99 },
      { store_name: 'PSB Mrówka', price: 13.99 }
    ]
  },
  {
    id: 172,
    name: 'Flex 125mm',
    description: 'Szlifierka kątowa 125mm 850W',
    brand: 'Bosch',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 199.99 },
      { store_name: 'Castorama', price: 209.99 },
      { store_name: 'OBI', price: 189.99 },
      { store_name: 'PSB Mrówka', price: 179.99 }
    ]
  },
  {
    id: 173,
    name: 'Poziomica',
    description: 'Poziomica aluminiowa 60cm',
    brand: 'Stanley',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 59.99 },
      { store_name: 'Castorama', price: 64.99 },
      { store_name: 'OBI', price: 54.99 },
      { store_name: 'PSB Mrówka', price: 49.99 }
    ]
  },
  {
    id: 174,
    name: 'Miara zwijana',
    description: 'Miara zwijana 5m',
    brand: 'Stanley',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 29.99 },
      { store_name: 'Castorama', price: 32.99 },
      { store_name: 'OBI', price: 27.99 },
      { store_name: 'PSB Mrówka', price: 24.99 }
    ]
  },
  {
    id: 175,
    name: 'Klej do płytek',
    description: 'Klej do płytek ceramicznych 25kg',
    brand: 'Ceresit',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 39.99 },
      { store_name: 'Castorama', price: 42.99 },
      { store_name: 'OBI', price: 37.99 },
      { store_name: 'PSB Mrówka', price: 34.99 }
    ]
  },
  {
    id: 176,
    name: 'Wkrętak krzyżakowy',
    description: 'Zestaw wkrętaków krzyżakowych 6 sztuk',
    brand: 'Stanley',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 49.99 },
      { store_name: 'Castorama', price: 54.99 },
      { store_name: 'OBI', price: 44.99 },
      { store_name: 'PSB Mrówka', price: 39.99 }
    ]
  },
  {
    id: 177,
    name: 'Silikon sanitarny',
    description: 'Silikon sanitarny biały 280ml',
    brand: 'Ceresit',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 18.99 },
      { store_name: 'Castorama', price: 19.99 },
      { store_name: 'OBI', price: 17.99 },
      { store_name: 'PSB Mrówka', price: 15.99 }
    ]
  },
  {
    id: 178,
    name: 'Tarcza do cięcia',
    description: 'Tarcza do cięcia kamienia 125mm',
    brand: 'Bosch',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 24.99 },
      { store_name: 'Castorama', price: 27.99 },
      { store_name: 'OBI', price: 22.99 },
      { store_name: 'PSB Mrówka', price: 19.99 }
    ]
  },
  {
    id: 179,
    name: 'Kostka brukowa',
    description: 'Kostka brukowa szara 20x10x6cm',
    brand: 'Libet',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 2.99 },
      { store_name: 'Castorama', price: 3.49 },
      { store_name: 'OBI', price: 2.79 },
      { store_name: 'PSB Mrówka', price: 2.49 }
    ]
  },
  {
    id: 180,
    name: 'Rękawice robocze',
    description: 'Rękawice robocze rozmiar L',
    brand: 'Lahti Pro',
    category_id: 24,
    category_name: 'Narzędzia i DIY',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 12.99 },
      { store_name: 'Castorama', price: 14.99 },
      { store_name: 'OBI', price: 11.99 },
      { store_name: 'PSB Mrówka', price: 9.99 }
    ]
  },

  // ===== HYPERMARKETS CATEGORY - 10 products for Carrefour, Auchan, Tesco, Real, Kaufland, E.Leclerc =====
  {
    id: 181,
    name: 'Detergent do prania',
    description: 'Proszek do prania uniwersalny 3kg',
    brand: 'Persil',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 24.99 },
      { store_name: 'Auchan', price: 23.99 },
      { store_name: 'Tesco', price: 25.99 },
      { store_name: 'Real', price: 26.49 },
      { store_name: 'Kaufland', price: 24.49 },
      { store_name: 'E.Leclerc', price: 23.49 }
    ]
  },
  {
    id: 182,
    name: 'Płyn do mycia naczyń',
    description: 'Płyn do naczyń cytrynowy 1L',
    brand: 'Fairy',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 8.99 },
      { store_name: 'Auchan', price: 8.49 },
      { store_name: 'Tesco', price: 9.49 },
      { store_name: 'Real', price: 9.99 },
      { store_name: 'Kaufland', price: 8.79 },
      { store_name: 'E.Leclerc', price: 8.29 }
    ]
  },
  {
    id: 183,
    name: 'Aspiryna',
    description: 'Aspiryna 500mg 20 tabletek',
    brand: 'Bayer',
    category_id: 14,
    category_name: 'Zdrowie',
    category_icon: '💊',
    prices: [
      { store_name: 'Carrefour', price: 12.99 },
      { store_name: 'Auchan', price: 11.99 },
      { store_name: 'Tesco', price: 13.99 },
      { store_name: 'Real', price: 14.49 },
      { store_name: 'Kaufland', price: 12.49 },
      { store_name: 'E.Leclerc', price: 11.49 }
    ]
  },
  {
    id: 184,
    name: 'Baterie AA',
    description: 'Baterie alkaliczne AA 8 sztuk',
    brand: 'Duracell',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 19.99 },
      { store_name: 'Auchan', price: 18.99 },
      { store_name: 'Tesco', price: 20.99 },
      { store_name: 'Real', price: 21.49 },
      { store_name: 'Kaufland', price: 19.49 },
      { store_name: 'E.Leclerc', price: 18.49 }
    ]
  },
  {
    id: 185,
    name: 'Worki na śmieci',
    description: 'Worki na śmieci 120L 10 sztuk',
    brand: 'Jan Niezbędny',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 14.99 },
      { store_name: 'Auchan', price: 13.99 },
      { store_name: 'Tesco', price: 15.99 },
      { store_name: 'Real', price: 16.49 },
      { store_name: 'Kaufland', price: 14.49 },
      { store_name: 'E.Leclerc', price: 13.49 }
    ]
  },
  {
    id: 186,
    name: 'Papier toaletowy',
    description: 'Papier toaletowy 3-warstwowy 24 rolki',
    brand: 'Zewa',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 29.99 },
      { store_name: 'Auchan', price: 28.99 },
      { store_name: 'Tesco', price: 31.99 },
      { store_name: 'Real', price: 32.49 },
      { store_name: 'Kaufland', price: 29.49 },
      { store_name: 'E.Leclerc', price: 27.99 }
    ]
  },
  {
    id: 187,
    name: 'Żarówka LED',
    description: 'Żarówka LED E27 10W',
    brand: 'Philips',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 24.99 },
      { store_name: 'Auchan', price: 23.99 },
      { store_name: 'Tesco', price: 26.99 },
      { store_name: 'Real', price: 27.49 },
      { store_name: 'Kaufland', price: 24.49 },
      { store_name: 'E.Leclerc', price: 22.99 }
    ]
  },
  {
    id: 188,
    name: 'Ręczniki papierowe',
    description: 'Ręczniki papierowe 6 rolek',
    brand: 'Regina',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 18.99 },
      { store_name: 'Auchan', price: 17.99 },
      { store_name: 'Tesco', price: 19.99 },
      { store_name: 'Real', price: 20.49 },
      { store_name: 'Kaufland', price: 18.49 },
      { store_name: 'E.Leclerc', price: 16.99 }
    ]
  },
  {
    id: 189,
    name: 'Płatki śniadaniowe',
    description: 'Płatki kukurydziane 500g',
    brand: 'Nestle',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Carrefour', price: 9.99 },
      { store_name: 'Auchan', price: 9.49 },
      { store_name: 'Tesco', price: 10.99 },
      { store_name: 'Real', price: 11.49 },
      { store_name: 'Kaufland', price: 9.79 },
      { store_name: 'E.Leclerc', price: 8.99 }
    ]
  },
  {
    id: 190,
    name: 'Płyn do podłóg',
    description: 'Płyn do mycia podłóg 1L',
    brand: 'Mr. Proper',
    category_id: 11,
    category_name: 'Dom i ogród',
    category_icon: '🏠',
    prices: [
      { store_name: 'Carrefour', price: 11.99 },
      { store_name: 'Auchan', price: 10.99 },
      { store_name: 'Tesco', price: 12.99 },
      { store_name: 'Real', price: 13.49 },
      { store_name: 'Kaufland', price: 11.49 },
      { store_name: 'E.Leclerc', price: 10.49 }
    ]
  },

  // ===== SPORTS CATEGORY - 10 products for Decathlon, Go Sport =====
  {
    id: 191,
    name: 'Piłka nożna',
    description: 'Piłka nożna skórzana rozmiar 5',
    brand: 'Kipsta',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 49.99 },
      { store_name: 'Go Sport', price: 54.99 }
    ]
  },
  {
    id: 192,
    name: 'Koszulka sportowa',
    description: 'Koszulka techniczna do biegania',
    brand: 'Domyos',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 29.99 },
      { store_name: 'Go Sport', price: 34.99 }
    ]
  },
  {
    id: 193,
    name: 'Rakieta tenisowa',
    description: 'Rakieta tenisowa dla początkujących',
    brand: 'Artengo',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 199.99 },
      { store_name: 'Go Sport', price: 219.99 }
    ]
  },
  {
    id: 194,
    name: 'Piłka do koszykówki',
    description: 'Piłka do koszykówki rozmiar 7',
    brand: 'Tarmak',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 79.99 },
      { store_name: 'Go Sport', price: 89.99 }
    ]
  },
  {
    id: 195,
    name: 'Szykłki pływackie',
    description: 'Okulary do pływania dla dorosłych',
    brand: 'Nabaiji',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 24.99 },
      { store_name: 'Go Sport', price: 29.99 }
    ]
  },
  {
    id: 196,
    name: 'Plecak trekkingowy',
    description: 'Plecak turystyczny 30L',
    brand: 'Quechua',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 149.99 },
      { store_name: 'Go Sport', price: 169.99 }
    ]
  },
  {
    id: 197,
    name: 'Buty trekkingowe',
    description: 'Buty górskie wodoodporne',
    brand: 'Quechua',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 199.99 },
      { store_name: 'Go Sport', price: 229.99 }
    ]
  },
  {
    id: 198,
    name: 'Czapka z daszkiem',
    description: 'Czapka sportowa z filtrem UV',
    brand: 'Domyos',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 19.99 },
      { store_name: 'Go Sport', price: 24.99 }
    ]
  },
  {
    id: 199,
    name: 'Łyżwy',
    description: 'Łyżwy figure rekreacyjne',
    brand: 'Oxelo',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 299.99 },
      { store_name: 'Go Sport', price: 329.99 }
    ]
  },
  {
    id: 200,
    name: 'Kij golfowy',
    description: 'Kij golfowy driver',
    brand: 'Inesis',
    category_id: 22,
    category_name: 'Sport i rekreacja',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 399.99 },
      { store_name: 'Go Sport', price: 449.99 }
    ]
  },

  // ===== FURNITURE CATEGORY - 10 products for IKEA, Jysk, Agata =====
  {
    id: 201,
    name: 'Pościel bawełniana',
    description: 'Komplet pościeli 160x200cm',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 79.99 },
      { store_name: 'Jysk', price: 89.99 },
      { store_name: 'Agata', price: 99.99 }
    ]
  },
  {
    id: 202,
    name: 'Poduszka puchowa',
    description: 'Poduszka z puchu gęsiego 50x70cm',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 129.99 },
      { store_name: 'Jysk', price: 119.99 },
      { store_name: 'Agata', price: 149.99 }
    ]
  },
  {
    id: 203,
    name: 'Lampa stołowa',
    description: 'Lampa biurkowa LED z ładowarką',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 199.99 },
      { store_name: 'Jysk', price: 229.99 },
      { store_name: 'Agata', price: 249.99 }
    ]
  },
  {
    id: 204,
    name: 'Dywan',
    description: 'Dywan wełniany 160x230cm',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 399.99 },
      { store_name: 'Jysk', price: 349.99 },
      { store_name: 'Agata', price: 449.99 }
    ]
  },
  {
    id: 205,
    name: 'Stolik kawowy',
    description: 'Stolik kawowy szklany',
    brand: 'Agata',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 199.99 },
      { store_name: 'Jysk', price: 249.99 },
      { store_name: 'Agata', price: 189.99 }
    ]
  },
  {
    id: 206,
    name: 'Zasłony',
    description: 'Zasłony blackout 140x250cm',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 89.99 },
      { store_name: 'Jysk', price: 99.99 },
      { store_name: 'Agata', price: 119.99 }
    ]
  },
  {
    id: 207,
    name: 'Kosz na pranie',
    description: 'Kosz na bieliznę z rattanu',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 79.99 },
      { store_name: 'Jysk', price: 69.99 },
      { store_name: 'Agata', price: 89.99 }
    ]
  },
  {
    id: 208,
    name: 'Organizer do szafy',
    description: 'System organizacji ubrań',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 49.99 },
      { store_name: 'Jysk', price: 59.99 },
      { store_name: 'Agata', price: 69.99 }
    ]
  },
  {
    id: 209,
    name: 'Donic donicka',
    description: 'Doniczka ceramiczna 30cm',
    brand: 'IKEA',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 29.99 },
      { store_name: 'Jysk', price: 34.99 },
      { store_name: 'Agata', price: 39.99 }
    ]
  },
  {
    id: 210,
    name: 'Wieszak na ubrania',
    description: 'Wieszak stojący metalowy',
    brand: 'Jysk',
    category_id: 21,
    category_name: 'Meble i wyposażenie',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 99.99 },
      { store_name: 'Jysk', price: 89.99 },
      { store_name: 'Agata', price: 109.99 }
    ]
  }
];

// Updated categories list with realistic product counts - COMPREHENSIVE LIST
const enhancedCategories = [
  // Food categories (existing + expanded)
  { id: 1, name: 'bread', name_pl: 'Pieczywo', icon: '🍞', product_count: 45 },
  { id: 2, name: 'dairy', name_pl: 'Nabiał', icon: '🥛', product_count: 32 },
  { id: 3, name: 'meat', name_pl: 'Mięso i ryby', icon: '🥩', product_count: 28 },
  { id: 4, name: 'vegetables', name_pl: 'Warzywa', icon: '🥕', product_count: 25 },
  { id: 5, name: 'fruits', name_pl: 'Owoce', icon: '🍎', product_count: 22 },
  { id: 6, name: 'drinks', name_pl: 'Napoje', icon: '🥤', product_count: 35 },
  { id: 7, name: 'sweets', name_pl: 'Słodycze', icon: '🍭', product_count: 28 },
  { id: 8, name: 'snacks', name_pl: 'Przekąski', icon: '🍿', product_count: 24 },
  { id: 9, name: 'frozen', name_pl: 'Mrożonki', icon: '🧊', product_count: 18 },
  { id: 10, name: 'organic', name_pl: 'Bio/Organiczne', icon: '🌱', product_count: 15 },
  
  // Non-food categories (existing + new)
  { id: 11, name: 'household', name_pl: 'Dom i ogród', icon: '🏠', product_count: 42 },
  { id: 12, name: 'hygiene', name_pl: 'Higiena', icon: '🧼', product_count: 38 },
  { id: 13, name: 'baby', name_pl: 'Dziecko', icon: '👶', product_count: 22 },
  { id: 14, name: 'health', name_pl: 'Zdrowie', icon: '💊', product_count: 28 },
  { id: 15, name: 'cosmetics', name_pl: 'Kosmetyki', icon: '💄', product_count: 32 },
  { id: 16, name: 'electronics', name_pl: 'Elektronika', icon: '📱', product_count: 35 },
  { id: 17, name: 'clothing', name_pl: 'Odzież', icon: '👕', product_count: 25 },
  { id: 18, name: 'books', name_pl: 'Książki', icon: '📚', product_count: 20 },
  { id: 19, name: 'automotive', name_pl: 'Paliwo i Samochód', icon: '🛢️', product_count: 15 },
  { id: 20, name: 'toys', name_pl: 'Zabawki', icon: '🧸', product_count: 18 },
  
  // NEW: Specialized categories
  { id: 21, name: 'furniture', name_pl: 'Meble i wyposażenie', icon: '🪑', product_count: 25 },
  { id: 22, name: 'sports', name_pl: 'Sport i rekreacja', icon: '⚽', product_count: 22 },
  { id: 23, name: 'pets', name_pl: 'Zwierzęta', icon: '🐕', product_count: 18 },
  { id: 24, name: 'tools', name_pl: 'Narzędzia i DIY', icon: '🔨', product_count: 20 },
  { id: 25, name: 'garden', name_pl: 'Ogród', icon: '🌻', product_count: 16 },
  { id: 26, name: 'alcohol', name_pl: 'Alkohol', icon: '🍷', product_count: 24 },
  { id: 27, name: 'ethnic_food', name_pl: 'Kuchnie świata', icon: '🌍', product_count: 30 },
  { id: 28, name: 'premium', name_pl: 'Premium', icon: '💎', product_count: 15 },
  { id: 29, name: 'convenience', name_pl: 'Convenience', icon: '🏪', product_count: 20 }
];

// Expanded stores list with Polish chains - COMPREHENSIVE LIST
const stores = [
  // Major discount chains (existing)
  { id: 1, name: 'Biedronka', type: 'discount', website: 'https://www.biedronka.pl', categories: ['fruits', 'bread', 'dairy', 'meat', 'vegetables', 'drinks', 'sweets'], location_count: 3000, logo: '🔴' },
  { id: 2, name: 'LIDL', type: 'discount', website: 'https://www.lidl.pl', categories: ['organic', 'bread', 'meat', 'dairy', 'fruits', 'vegetables'], location_count: 800, logo: '🔵' },
  { id: 3, name: 'Netto', type: 'discount', website: 'https://www.netto.pl', categories: ['fruits', 'vegetables', 'dairy'], location_count: 400, logo: '🟡' },
  { id: 4, name: 'Dino', type: 'discount', website: 'https://www.dino.pl', categories: ['local', 'fresh', 'meat', 'dairy'], location_count: 2000, logo: '🦕' },
  { id: 5, name: 'Stokrotka', type: 'discount', website: 'https://www.stokrotka.pl', categories: ['daily', 'fresh', 'dairy'], location_count: 700, logo: '🌼' },
  { id: 6, name: 'Polomarket', type: 'discount', website: 'https://www.polomarket.pl', categories: ['local', 'meat', 'dairy'], location_count: 280, logo: '🔷' },
  
  // Hypermarkets (existing + new)
  { id: 7, name: 'Carrefour', type: 'hypermarket', website: 'https://www.carrefour.pl', categories: ['food', 'electronics', 'clothing', 'household'], location_count: 90, logo: '🛒' },
  { id: 8, name: 'Auchan', type: 'hypermarket', website: 'https://www.auchan.pl', categories: ['electronics', 'clothing', 'home', 'food', 'frozen'], location_count: 90, logo: '🏪' },
  { id: 9, name: 'Tesco', type: 'hypermarket', website: 'https://www.tesco.pl', categories: ['food', 'household', 'electronics'], location_count: 450, logo: '🔴' },
  { id: 10, name: 'Real', type: 'hypermarket', website: 'https://www.real.de', categories: ['food', 'household', 'clothing'], location_count: 50, logo: '🟢' },
  { id: 11, name: 'Kaufland', type: 'hypermarket', website: 'https://www.kaufland.pl', categories: ['food', 'household', 'electronics'], location_count: 240, logo: '🔴' },
  { id: 12, name: 'E.Leclerc', type: 'hypermarket', website: 'https://www.e-leclerc.pl', categories: ['food', 'electronics', 'automotive'], location_count: 25, logo: '🟠' },
  
  // NEW: Additional discount chains
  { id: 51, name: 'Aldi', type: 'discount', website: 'https://www.aldi.pl', categories: ['organic', 'german', 'dairy'], location_count: 150, logo: '🟦' },
  { id: 52, name: 'Intermarché', type: 'discount', website: 'https://www.intermarche.pl', categories: ['french', 'premium'], location_count: 200, logo: '🇫🇷' },
  
  // Convenience stores (existing)
  { id: 13, name: 'Żabka', type: 'convenience', website: 'https://www.zabka.pl', categories: ['snacks', 'drinks', 'sweets', 'dairy'], location_count: 8000, logo: '🐸' },
  { id: 14, name: 'Freshmarket', type: 'convenience', website: 'https://www.freshmarket.pl', categories: ['fresh', 'daily', 'convenience'], location_count: 190, logo: '🥬' },
  { id: 15, name: 'Lewiatan', type: 'convenience', website: 'https://www.lewiatan.pl', categories: ['local', 'daily', 'convenience'], location_count: 3000, logo: '⚓' },
  { id: 16, name: 'Spar', type: 'convenience', website: 'https://www.spar.pl', categories: ['international', 'convenience'], location_count: 120, logo: '🌟' },
  { id: 17, name: 'Delikatesy Centrum', type: 'premium', website: 'https://www.dc.pl', categories: ['premium', 'delicatessen'], location_count: 350, logo: '💎' },
  
  // NEW: Online & Premium stores
  { id: 53, name: 'Frisco.pl', type: 'online', website: 'https://www.frisco.pl', categories: ['premium', 'organic', 'delivery'], location_count: 1, logo: '📦' },
  { id: 54, name: 'Barbora', type: 'online', website: 'https://www.barbora.pl', categories: ['online', 'fresh', 'delivery'], location_count: 1, logo: '🚚' },
  { id: 55, name: 'Żabka Nano', type: 'convenience', website: 'https://www.zabka.pl', categories: ['automated', 'tech', 'convenience'], location_count: 25, logo: '🤖' },
  
  // Drugstores (existing)
  { id: 19, name: 'Rossmann', type: 'drugstore', website: 'https://www.rossmann.pl', categories: ['hygiene', 'baby', 'household', 'sweets'], location_count: 1800, logo: '💊' },
  { id: 20, name: 'Super-Pharm', type: 'drugstore', website: 'https://www.super-pharm.pl', categories: ['pharmacy', 'cosmetics'], location_count: 290, logo: '💉' },
  { id: 21, name: 'Hebe', type: 'drugstore', website: 'https://www.hebe.pl', categories: ['cosmetics', 'perfumes'], location_count: 280, logo: '💄' },
  { id: 22, name: 'Doz.pl', type: 'drugstore', website: 'https://www.doz.pl', categories: ['pharmacy', 'health'], location_count: 170, logo: '🏥' },
  
  // Furniture & Home (existing + new)
  { id: 23, name: 'IKEA', type: 'furniture', website: 'https://www.ikea.com/pl', categories: ['household', 'home', 'kitchen', 'food'], location_count: 15, logo: '🏠' },
  { id: 24, name: 'Leroy Merlin', type: 'home_improvement', website: 'https://www.leroymerlin.pl', categories: ['household', 'home', 'garden'], location_count: 80, logo: '🔨' },
  { id: 25, name: 'Castorama', type: 'home_improvement', website: 'https://www.castorama.pl', categories: ['diy', 'garden', 'tools'], location_count: 75, logo: '🛠️' },
  { id: 26, name: 'OBI', type: 'home_improvement', website: 'https://www.obi.pl', categories: ['garden', 'tools', 'building'], location_count: 65, logo: '🧰' },
  { id: 27, name: 'Jysk', type: 'furniture', website: 'https://www.jysk.pl', categories: ['furniture', 'home', 'bedding'], location_count: 180, logo: '🛏️' },
  { id: 28, name: 'Black Red White', type: 'furniture', website: 'https://www.brw.pl', categories: ['furniture', 'bedroom', 'living'], location_count: 120, logo: '⚫' },
  
  // NEW: Additional furniture stores
  { id: 56, name: 'Agata', type: 'furniture', website: 'https://www.agata.pl', categories: ['furniture', 'home', 'decor'], location_count: 80, logo: '🪴' },
  { id: 57, name: 'PSB Mrówka', type: 'home_improvement', website: 'https://www.psb-mrówka.pl', categories: ['building', 'tools', 'garden'], location_count: 200, logo: '🐜' },
  
  // Specialized stores (existing)
  { id: 29, name: 'Pepco', type: 'retail', website: 'https://www.pepco.pl', categories: ['clothing', 'household', 'toys'], location_count: 600, logo: '🎯' },
  { id: 30, name: 'Action', type: 'retail', website: 'https://www.action.com/pl', categories: ['household', 'toys', 'seasonal'], location_count: 200, logo: '💥' },
  { id: 31, name: 'TEDi', type: 'retail', website: 'https://www.tedi.com', categories: ['household', 'decoration', 'toys'], location_count: 180, logo: '🧸' },
  { id: 32, name: 'Dealz', type: 'retail', website: 'https://www.dealz.ie', categories: ['household', 'toys', 'stationery'], location_count: 50, logo: '💰' },
  
  // NEW: Alternative stores
  { id: 58, name: 'Flying Tiger', type: 'retail', website: 'https://www.flyingtiger.com', categories: ['design', 'toys', 'gifts'], location_count: 30, logo: '🐅' },
  
  // Electronics (existing)
  { id: 33, name: 'Media Markt', type: 'electronics', website: 'https://www.mediamarkt.pl', categories: ['electronics', 'appliances'], location_count: 35, logo: '📱' },
  { id: 34, name: 'Saturn', type: 'electronics', website: 'https://www.saturn.pl', categories: ['electronics', 'gaming'], location_count: 8, logo: '🪐' },
  { id: 35, name: 'RTV Euro AGD', type: 'electronics', website: 'https://www.euro.com.pl', categories: ['electronics', 'appliances'], location_count: 350, logo: '📺' },
  { id: 36, name: 'Neo24', type: 'electronics', website: 'https://www.neo24.pl', categories: ['electronics', 'mobile'], location_count: 180, logo: '📲' },
  
  // NEW: Additional electronics
  { id: 59, name: 'Neonet', type: 'electronics', website: 'https://www.neonet.pl', categories: ['electronics', 'computers'], location_count: 120, logo: '💻' },
  
  // Clothing (existing)
  { id: 37, name: 'H&M', type: 'clothing', website: 'https://www.hm.com/pl', categories: ['fashion', 'clothing'], location_count: 120, logo: '👕' },
  { id: 38, name: 'Reserved', type: 'clothing', website: 'https://www.reserved.com/pl', categories: ['fashion', 'polish'], location_count: 250, logo: '🇵🇱' },
  { id: 39, name: 'CCC', type: 'shoes', website: 'https://www.ccc.eu', categories: ['shoes', 'accessories'], location_count: 400, logo: '👟' },
  { id: 40, name: 'Deichmann', type: 'shoes', website: 'https://www.deichmann.com/pl', categories: ['shoes', 'bags'], location_count: 200, logo: '👠' },
  
  // Bookstores & Culture (existing)
  { id: 41, name: 'Empik', type: 'bookstore', website: 'https://www.empik.com', categories: ['books', 'music', 'electronics'], location_count: 250, logo: '📚' },
  { id: 42, name: 'Matras', type: 'bookstore', website: 'https://www.matras.pl', categories: ['books', 'stationery'], location_count: 80, logo: '📖' },
  
  // NEW: Additional bookstores
  { id: 60, name: 'Świat Książki', type: 'bookstore', website: 'https://www.swiat-ksiazki.pl', categories: ['books', 'literature'], location_count: 60, logo: '📗' },
  
  // Sports (existing)
  { id: 43, name: 'Decathlon', type: 'sports', website: 'https://www.decathlon.pl', categories: ['sports', 'outdoor'], location_count: 50, logo: '⚽' },
  { id: 44, name: 'Go Sport', type: 'sports', website: 'https://www.gosport.pl', categories: ['sports', 'fitness'], location_count: 45, logo: '🏃' },
  
  // Pharmacies (existing)
  { id: 45, name: 'Apteka Gemini', type: 'pharmacy', website: 'https://www.gemini.pl', categories: ['pharmacy', 'health'], location_count: 1200, logo: '💊' },
  { id: 46, name: 'Ziko Apteka', type: 'pharmacy', website: 'https://www.ziko.pl', categories: ['pharmacy', 'health'], location_count: 800, logo: '⚕️' },
  { id: 47, name: 'Apteka DOZ', type: 'pharmacy', website: 'https://www.doz.pl', categories: ['pharmacy', 'supplements'], location_count: 400, logo: '🏥' },
  
  // Petrol stations with shops (existing)
  { id: 48, name: 'Orlen', type: 'petrol', website: 'https://www.orlen.pl', categories: ['fuel', 'convenience', 'coffee'], location_count: 2800, logo: '⛽' },
  { id: 49, name: 'BP', type: 'petrol', website: 'https://www.bp.com/pl', categories: ['fuel', 'convenience'], location_count: 500, logo: '🟢' },
  { id: 50, name: 'Shell', type: 'petrol', website: 'https://www.shell.pl', categories: ['fuel', 'convenience'], location_count: 400, logo: '🐚' },
  
  // NEW: Additional petrol stations
  { id: 61, name: 'Circle K', type: 'petrol', website: 'https://www.circlek.pl', categories: ['fuel', 'convenience', 'fast-food'], location_count: 350, logo: '⭕' },
  
  // NEW: Pet stores
  { id: 62, name: 'Maxi Zoo', type: 'pet_store', website: 'https://www.maxizoo.pl', categories: ['pets', 'animal'], location_count: 120, logo: '🐕' },
  { id: 63, name: 'Kakadu', type: 'pet_store', website: 'https://www.kakadu.pl', categories: ['pets', 'birds'], location_count: 80, logo: '🦜' },
  { id: 64, name: 'Zooplus.pl', type: 'pet_store', website: 'https://www.zooplus.pl', categories: ['pets', 'online'], location_count: 1, logo: '🐾' },
  { id: 65, name: 'PetSmile', type: 'pet_store', website: 'https://www.petsmile.pl', categories: ['pets', 'grooming'], location_count: 45, logo: '😺' },
  
  // NEW: Ethnic stores
  { id: 66, name: 'Sklep Turecki', type: 'ethnic', website: 'https://www.turcja.pl', categories: ['turkish', 'ethnic'], location_count: 200, logo: '🇹🇷' },
  { id: 67, name: 'Vietnam Market', type: 'ethnic', website: 'https://www.vietnam.pl', categories: ['vietnamese', 'asian'], location_count: 150, logo: '🇻🇳' },
  { id: 68, name: 'Sklep Indyjski', type: 'ethnic', website: 'https://www.indie.pl', categories: ['indian', 'spices'], location_count: 80, logo: '🇮🇳' },
  { id: 69, name: 'Ukraiński Market', type: 'ethnic', website: 'https://www.ukraina.pl', categories: ['ukrainian', 'eastern'], location_count: 300, logo: '🇺🇦' }
];

// Function to generate smart product distribution across stores
function generateSmartStoreProducts() {
  const products = [];
  
  // For each product in the enhanced product list
  enhancedProducts.forEach(product => {
    // Get the category mapping for stores that should carry this product
    const productCategory = product.category_id;
    
    // Find stores that can sell this category
    const eligibleStores = stores.filter(store => {
      const categoryMapping = STORE_CATEGORY_MAPPING[store.type];
      return categoryMapping && categoryMapping.allowed_categories.includes(productCategory);
    });
    
    // Generate prices for eligible stores
    const prices = [];
    
    // Base price calculation
    const basePrice = product.prices && product.prices.length > 0 
      ? product.prices[0].price 
      : Math.random() * 50 + 5; // Random price between 5-55 PLN
    
    eligibleStores.forEach(store => {
      // Price variation based on store type
      let priceMultiplier = 1.0;
      
      switch(store.type) {
        case 'discount':
          priceMultiplier = 0.85 + Math.random() * 0.2; // 85-105% of base
          break;
        case 'hypermarket':
          priceMultiplier = 0.9 + Math.random() * 0.25; // 90-115% of base
          break;
        case 'convenience':
          priceMultiplier = 1.1 + Math.random() * 0.3; // 110-140% of base
          break;
        case 'drugstore':
        case 'pharmacy':
          priceMultiplier = 0.95 + Math.random() * 0.2; // 95-115% of base
          break;
        case 'furniture':
        case 'electronics':
        case 'clothing':
          priceMultiplier = 0.9 + Math.random() * 0.4; // 90-130% of base
          break;
        default:
          priceMultiplier = 0.95 + Math.random() * 0.1; // 95-105% of base
      }
      
      const finalPrice = Math.round(basePrice * priceMultiplier * 100) / 100;
      
      // Random promotions (10% chance)
      const hasPromotion = Math.random() < 0.1;
      const discountPercentage = hasPromotion ? Math.floor(Math.random() * 25) + 5 : 0; // 5-30% discount
      
      prices.push({
        store_name: store.name,
        price: finalPrice,
        is_promotion: hasPromotion,
        discount_percentage: discountPercentage
      });
    });
    
    // Only add product if it has prices in at least one store
    if (prices.length > 0) {
      products.push({
        ...product,
        prices: prices
      });
    }
  });
  
  return products;
}

// Generate the smart product list
const smartProducts = generateSmartStoreProducts();

console.log(`✅ Smart system created: ${smartProducts.length} products distributed across ${stores.length} stores`);

// Health endpoint 
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GroceryCompare Poland API is running',
    total_products: smartProducts.length,
    total_stores: stores.length,
    total_categories: enhancedCategories.length,
    version: '2.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hoş geldiniz - GroceryCompare Poland API',
    description: 'Polonya için akıllı market fiyat karşılaştırma platformu',
    version: '2.0.0',
    features: ['Dynamic product distribution', '50 store chains', 'Real-time price comparison', 'AI recommendations'],
    endpoints: {
      health: '/health',
      products: '/api/products',
      stores: '/api/stores',
      categories: '/api/products/categories'
    }
  });
});

// Products API
app.get('/api/products', (req, res) => {
  const { 
    search, 
    category, 
    store, 
    limit = 50, 
    sort = 'price', 
    min_price, 
    max_price 
  } = req.query;

  let filteredProducts = smartProducts;

  // Filter by search term
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category_id === parseInt(category)
    );
  }

  // Filter by store
  if (store) {
    filteredProducts = filteredProducts.filter(product => 
      product.prices.some(price => 
        price.store_name.toLowerCase().includes(store.toLowerCase())
      )
    );
  }

  // Filter by price range
  if (min_price || max_price) {
    filteredProducts = filteredProducts.filter(product => {
      const minPrice = Math.min(...product.prices.map(p => p.price));
      if (min_price && minPrice < parseFloat(min_price)) return false;
      if (max_price && minPrice > parseFloat(max_price)) return false;
      return true;
    });
  }

  // Sort products
  if (sort === 'price') {
    filteredProducts.sort((a, b) => {
      const aMinPrice = Math.min(...a.prices.map(p => p.price));
      const bMinPrice = Math.min(...b.prices.map(p => p.price));
      return aMinPrice - bMinPrice;
    });
  } else if (sort === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Limit results
  const limitedProducts = filteredProducts.slice(0, parseInt(limit));

  res.json({
    success: true,
    data: limitedProducts,
    meta: {
      total: filteredProducts.length,
      showing: limitedProducts.length,
      filters: { search, category, store, sort }
    }
  });
});

// Categories API - MUST BE BEFORE /api/products/:id
app.get('/api/products/categories', (req, res) => {
  // Calculate actual product counts for each category
  const categoriesWithCounts = enhancedCategories.map(category => ({
    ...category,
    product_count: smartProducts.filter(product => product.category_id === category.id).length
  }));

  res.json({
    success: true,
    message: 'Kategorie pobrane pomyślnie',
    data: categoriesWithCounts,
    meta: {
      total: categoriesWithCounts.length,
      total_products: smartProducts.length
    }
  });
});

// Trending/Popular products - MUST BE BEFORE /api/products/:id
app.get('/api/products/trending', (req, res) => {
  const trendingProducts = smartProducts
    .filter(product => Math.random() > 0.3) // Simulate trending products
    .sort((a, b) => {
      const aMinPrice = Math.min(...a.prices.map(p => p.price));
      const bMinPrice = Math.min(...b.prices.map(p => p.price));
      return aMinPrice - bMinPrice;
    })
    .slice(0, 12);
  
  res.json({
    success: true,
    data: trendingProducts,
    message: 'Popularne i promocyjne produkty',
    meta: {
      total: trendingProducts.length,
      avg_discount: '25%',
      updated_at: new Date().toISOString()
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = smartProducts.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  res.json({
    success: true,
    message: 'Produkt pobrany pomyślnie',
    data: product
  });
});

// Stores API
app.get('/api/stores', (req, res) => {
  const type = req.query.type;
  let filteredStores = [...stores];

  if (type) {
    filteredStores = filteredStores.filter(store => store.type === type);
  }

  res.json({
    success: true,
    message: 'Sklepy pobrane pomyślnie',
    data: filteredStores,
    meta: {
      total: filteredStores.length,
      types: [...new Set(stores.map(s => s.type))]
    }
  });
});

// New: Stores with products endpoint - MUST BE BEFORE /api/stores/:id
app.get('/api/stores/with-products', (req, res) => {
  const storesWithProducts = stores.map(store => {
    // Get all products available in this store using dynamic products
    const storeProducts = smartProducts.filter(product => 
      product.prices.some(price => price.store_name === store.name)
    );
    
    return {
      ...store,
      products: storeProducts.map(product => ({
        ...product,
        price_at_store: product.prices.find(p => p.store_name === store.name)
      }))
    };
  }).filter(store => store.products.length > 0); // Only include stores with products

  res.json({
    success: true,
    message: 'Sklepy z produktami pobrane pomyślnie',
    data: storesWithProducts,
    meta: {
      total: storesWithProducts.length,
      total_products: smartProducts.length,
      min_products_per_store: Math.min(...storesWithProducts.map(s => s.products.length)),
      max_products_per_store: Math.max(...storesWithProducts.map(s => s.products.length)),
      avg_products_per_store: Math.round(storesWithProducts.reduce((sum, s) => sum + s.products.length, 0) / storesWithProducts.length)
    }
  });
});

app.get('/api/stores/:id', (req, res) => {
  const storeId = parseInt(req.params.id);
  const store = stores.find(s => s.id === storeId);
  
  if (!store) {
    return res.status(404).json({
      success: false,
      error: 'Sklep nie został znaleziony'
    });
  }

  // Get products available in this store
  const storeProducts = smartProducts.filter(product => 
    product.prices.some(price => price.store_name === store.name)
  );

  res.json({
    success: true,
    message: 'Sklep pobrany pomyślnie',
    data: {
      ...store,
      available_products: storeProducts.length,
      sample_products: storeProducts.slice(0, 5)
    }
  });
});

// New: Search endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter required'
    });
  }

  const searchResults = smartProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  res.json({
    success: true,
    message: `Znaleziono ${searchResults.length} produktów`,
    data: searchResults,
    meta: {
      query,
      total: searchResults.length
    }
  });
});

// NEW: Promotions API endpoint
app.get('/api/promotions', (req, res) => {
  const promotionProducts = smartProducts.filter(product => 
    product.prices.some(price => price.is_promotion)
  );

  res.json({
    success: true,
    message: 'Aktualne promocje pobrane pomyślnie',
    data: promotionProducts,
    meta: {
      total: promotionProducts.length,
      average_discount: Math.round(
        promotionProducts.reduce((sum, product) => {
          const promotion = product.prices.find(p => p.is_promotion);
          return sum + (promotion ? promotion.discount_percentage : 0);
        }, 0) / promotionProducts.length
      )
    }
  });
});

// NEW: Cart API endpoints (simple in-memory storage for demo)
const userCarts = {}; // In real app, this would be in database

app.post('/api/cart/add', (req, res) => {
  const { userId = 'guest', productId, storeId, quantity = 1 } = req.body;
  
  const product = smartProducts.find(p => p.id === parseInt(productId));
  const store = stores.find(s => s.id === parseInt(storeId));
  
  if (!product || !store) {
    return res.status(404).json({
      success: false,
      error: 'Produkt lub sklep nie został znaleziony'
    });
  }

  const price = product.prices.find(p => p.store_name === store.name);
  if (!price) {
    return res.status(404).json({
      success: false,
      error: 'Produkt niedostępny w tym sklepie'
    });
  }

  if (!userCarts[userId]) {
    userCarts[userId] = [];
  }

  const existingItem = userCarts[userId].find(item => 
    item.productId === productId && item.storeId === storeId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCarts[userId].push({
      productId,
      storeId,
      quantity,
      product,
      store,
      price: price.price,
      is_promotion: price.is_promotion,
      discount_percentage: price.discount_percentage
    });
  }

  res.json({
    success: true,
    message: 'Produkt dodany do koszyka',
    cart_count: userCarts[userId].length
  });
});

// NEW: Favorites API endpoints
const userFavorites = {}; // In real app, this would be in database

app.post('/api/favorites/add', (req, res) => {
  const { userId = 'guest', productId } = req.body;
  
  if (!userFavorites[userId]) {
    userFavorites[userId] = [];
  }
  
  if (!userFavorites[userId].includes(productId)) {
    userFavorites[userId].push(productId);
  }
  
  res.json({
    success: true,
    message: 'Produkt dodany do ulubionych',
    favorites_count: userFavorites[userId].length
  });
});

app.get('/api/favorites/:userId', (req, res) => {
  const { userId } = req.params;
  const favorites = userFavorites[userId] || [];
  
  const favoriteProducts = smartProducts.filter(product => 
    favorites.includes(product.id)
  );
  
  res.json({
    success: true,
    data: favoriteProducts,
    total: favoriteProducts.length
  });
});

// NEW: Price tracking API endpoint
app.post('/api/price-tracking/add', (req, res) => {
  const { userId = 'guest', productId, targetPrice } = req.body;
  
  const product = smartProducts.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  res.json({
    success: true,
    message: 'Śledzenie ceny aktywowane',
    data: {
      productId,
      targetPrice,
      currentBestPrice: Math.min(...product.prices.map(p => p.price)),
      alert_active: true
    }
  });
});

// NEW: Nearby stores API endpoint (mock data)
app.get('/api/stores/nearby', (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  
  // Mock nearby stores with distances
  const nearbyStores = stores.slice(0, 8).map((store, index) => ({
    ...store,
    distance: Math.round((Math.random() * 3 + 0.5) * 100) / 100, // 0.5-3.5 km
    walking_time: Math.round(Math.random() * 20 + 5), // 5-25 minutes
    is_open: Math.random() > 0.2, // 80% chance of being open
    coordinates: {
      lat: 52.2297 + (Math.random() - 0.5) * 0.1,
      lng: 21.0122 + (Math.random() - 0.5) * 0.1
    }
  })).sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    message: 'Sklepy w pobliżu pobrane pomyślnie',
    data: nearbyStores,
    meta: {
      search_center: { lat: parseFloat(lat) || 52.2297, lng: parseFloat(lng) || 21.0122 },
      radius_km: radius,
      total: nearbyStores.length
    }
  });
});

// NEW: Shopping List API endpoints
const userShoppingLists = {}; // In real app, this would be in database

app.post('/api/shopping-list/add', (req, res) => {
  const { userId = 'guest', productId, quantity = 1, notes = '' } = req.body;
  
  const product = smartProducts.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  if (!userShoppingLists[userId]) {
    userShoppingLists[userId] = [];
  }

  const existingItem = userShoppingLists[userId].find(item => 
    item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userShoppingLists[userId].push({
      id: Date.now(),
      productId,
      quantity,
      notes,
      product,
      added_date: new Date().toISOString(),
      completed: false
    });
  }

  res.json({
    success: true,
    message: 'Produkt dodany do listy zakupów',
    total_items: userShoppingLists[userId].length
  });
});

app.get('/api/shopping-list/:userId', (req, res) => {
  const { userId } = req.params;
  const list = userShoppingLists[userId] || [];
  
  // Calculate total cost for different stores
  const storeTotals = {};
  
  list.forEach(item => {
    item.product.prices.forEach(price => {
      if (!storeTotals[price.store_name]) {
        storeTotals[price.store_name] = 0;
      }
      storeTotals[price.store_name] += price.price * item.quantity;
    });
  });

  // Find cheapest store for the entire list
  const cheapestStore = Object.entries(storeTotals).reduce((min, [store, total]) => 
    total < min.total ? { store, total } : min, 
    { store: '', total: Infinity }
  );

  res.json({
    success: true,
    data: {
      items: list,
      store_totals: storeTotals,
      cheapest_store: cheapestStore,
      total_items: list.length,
      estimated_savings: cheapestStore.total > 0 ? 
        Math.max(...Object.values(storeTotals)) - cheapestStore.total : 0
    }
  });
});

// NEW: Smart Shopping Route Optimization
app.post('/api/shopping-route/optimize', (req, res) => {
  const { userId = 'guest', stores, lat = 52.2297, lng = 21.0122 } = req.body;
  
  // Mock route optimization
  const optimizedRoute = stores.map((store, index) => ({
    ...store,
    order: index + 1,
    estimated_time: Math.round(Math.random() * 15 + 5), // 5-20 minutes
    distance: Math.round((Math.random() * 3 + 0.5) * 100) / 100, // 0.5-3.5 km
    products_available: Math.floor(Math.random() * 20 + 10) // 10-30 products
  })).sort((a, b) => a.distance - b.distance);

  const totalTime = optimizedRoute.reduce((sum, store) => sum + store.estimated_time, 0);
  const totalDistance = optimizedRoute.reduce((sum, store) => sum + store.distance, 0);

  res.json({
    success: true,
    message: 'Trasa zoptymalizowana pomyślnie',
    data: {
      optimized_route: optimizedRoute,
      total_time_minutes: totalTime,
      total_distance_km: Math.round(totalDistance * 100) / 100,
      estimated_savings: Math.round(Math.random() * 50 + 20) // 20-70 PLN savings
    }
  });
});

// NEW: Price History API (mock data)
app.get('/api/products/:id/price-history', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = smartProducts.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produkt nie został znaleziony'
    });
  }

  // Generate mock price history for last 30 days
  const history = [];
  const currentPrice = Math.min(...product.prices.map(p => p.price));
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic price fluctuation
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const price = Math.round((currentPrice * (1 + variation)) * 100) / 100;
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, 0.1), // Minimum price
      store: 'Najniższa cena'
    });
  }

  res.json({
    success: true,
    data: {
      product_id: productId,
      product_name: product.name,
      current_price: currentPrice,
      price_history: history,
      average_price: Math.round(history.reduce((sum, h) => sum + h.price, 0) / history.length * 100) / 100,
      lowest_price: Math.min(...history.map(h => h.price)),
      highest_price: Math.max(...history.map(h => h.price)),
      trend: history[history.length - 1].price > history[0].price ? 'rising' : 'falling'
    }
  });
});

// NEW: AI Product Recommendations
app.post('/api/ai/recommendations', (req, res) => {
  const { userId = 'guest', preferences = {}, budget = 100 } = req.body;
  
  // Simple AI logic - recommend products based on preferences
  let recommendedProducts = [...smartProducts];
  
  // Filter by dietary preferences
  if (preferences.dietType === 'vegetarian') {
    recommendedProducts = recommendedProducts.filter(p => 
      !p.category_name.includes('Mięso') && !p.name.toLowerCase().includes('kiełbasa')
    );
  }
  
  // Sort by best deals (price + promotions)
  recommendedProducts = recommendedProducts
    .map(product => {
      const bestPrice = Math.min(...product.prices.map(p => p.price));
      const hasPromotion = product.prices.some(p => p.is_promotion);
      const score = hasPromotion ? bestPrice * 0.8 : bestPrice; // Boost promoted items
      
      return { ...product, recommendation_score: score };
    })
    .sort((a, b) => a.recommendation_score - b.recommendation_score)
    .slice(0, 10);

  res.json({
    success: true,
    message: 'AI rekomendacje wygenerowane',
    data: {
      recommended_products: recommendedProducts,
      total_estimated_cost: Math.round(recommendedProducts.reduce((sum, p) => 
        sum + Math.min(...p.prices.map(price => price.price)), 0) * 100) / 100,
      savings_potential: Math.round(Math.random() * 30 + 10), // 10-40 PLN
      personalization_level: preferences.dietType ? 'high' : 'medium'
    }
  });
});

// Enhanced product search with filters
app.get('/api/products/search', (req, res) => {
  const { 
    q = '', 
    category, 
    store, 
    min_price, 
    max_price, 
    sort = 'price_asc',
    limit = 20 
  } = req.query;
  
  let results = smartProducts;
  
  // Search by query
  if (q) {
    const searchTerm = q.toLowerCase();
    results = results.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category_name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  if (category) {
    results = results.filter(product => product.category_id === parseInt(category));
  }
  
  // Filter by store
  if (store) {
    results = results.filter(product => 
      product.prices.some(price => 
        price.store_name.toLowerCase().includes(store.toLowerCase())
      )
    );
  }
  
  // Filter by price range
  if (min_price || max_price) {
    results = results.filter(product => {
      const minPrice = Math.min(...product.prices.map(p => p.price));
      if (min_price && minPrice < parseFloat(min_price)) return false;
      if (max_price && minPrice > parseFloat(max_price)) return false;
      return true;
    });
  }
  
  // Sort results
  if (sort === 'price_asc') {
    results.sort((a, b) => {
      const aMinPrice = Math.min(...a.prices.map(p => p.price));
      const bMinPrice = Math.min(...b.prices.map(p => p.price));
      return aMinPrice - bMinPrice;
    });
  } else if (sort === 'price_desc') {
    results.sort((a, b) => {
      const aMinPrice = Math.min(...a.prices.map(p => p.price));
      const bMinPrice = Math.min(...b.prices.map(p => p.price));
      return bMinPrice - aMinPrice;
    });
  } else if (sort === 'name') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // Limit results
  const limitedResults = results.slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: limitedResults,
    query: q,
    filters: { category, store, min_price, max_price, sort },
    total: results.length,
    showing: limitedResults.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║       🛒 GroceryCompare Poland API v2.0       ║
║                 EXPANDED DEMO                ║
║                                              ║
║  🚀 Server: http://localhost:${PORT}           ║
║  ❤️  Health: http://localhost:${PORT}/health     ║
║                                              ║
║  📊 ${smartProducts.length} Products | ${stores.length} Stores                    ║
║  🏪 IKEA, Rossmann, Leroy Merlin added      ║
║  💰 Real Polish prices & promotions         ║
╚══════════════════════════════════════════════╝
  `);
});