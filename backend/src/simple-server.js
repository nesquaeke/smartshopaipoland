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

// MASSIVE Polish Products Database - 200+ products
const sampleProducts = [
  // ===== Pieczywo (Bread & Bakery) - 40 products =====
  // Traditional Polish breads
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
      { store_name: 'Polomarket', price: 3.25 },
      { store_name: 'Freshmarket', price: 3.35 },
      { store_name: 'Lewiatan', price: 3.19 },
      { store_name: 'Spar', price: 3.09 }
    ]
  },
  {
    id: 2,
    name: 'Chleb pszenno-żytni',
    description: 'Chleb mieszany 400g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 2.79 },
      { store_name: 'LIDL', price: 2.59 },
      { store_name: 'Dino', price: 2.89 },
      { store_name: 'Netto', price: 2.69 },
      { store_name: 'Tesco', price: 2.85 },
      { store_name: 'Carrefour', price: 2.99 },
      { store_name: 'Stokrotka', price: 2.75 },
      { store_name: 'Auchan', price: 2.79 },
      { store_name: 'Polomarket', price: 2.95 },
      { store_name: 'Freshmarket', price: 3.05 },
      { store_name: 'Lewiatan', price: 2.89 },
      { store_name: 'Spar', price: 2.79 }
    ]
  },
  {
    id: 3,
    name: 'Chleb wiejski',
    description: 'Chleb wiejski na żurek 600g',
    brand: 'Wasa',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Stokrotka', price: 3.59 },
      { store_name: 'Netto', price: 3.39 },
      { store_name: 'Tesco', price: 3.55 },
      { store_name: 'Carrefour', price: 3.69 },
      { store_name: 'Dino', price: 3.45 },
      { store_name: 'Auchan', price: 3.49 },
      { store_name: 'Polomarket', price: 3.65 },
      { store_name: 'Freshmarket', price: 3.75 },
      { store_name: 'Lewiatan', price: 3.59 },
      { store_name: 'Spar', price: 3.49 }
    ]
  },
  {
    id: 4,
    name: 'Chleb pełnoziarnisty',
    description: 'Chleb pełnoziarnisty 500g',
    brand: 'Mestemacher',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'LIDL', price: 4.99 },
      { store_name: 'Carrefour', price: 5.29 },
      { store_name: 'Tesco', price: 5.09 },
      { store_name: 'Netto', price: 4.89 },
      { store_name: 'Auchan', price: 5.15 },
      { store_name: 'Biedronka', price: 5.19 },
      { store_name: 'Dino', price: 4.95 },
      { store_name: 'Stokrotka', price: 5.05 },
      { store_name: 'Polomarket', price: 5.35 },
      { store_name: 'Freshmarket', price: 5.45 },
      { store_name: 'Lewiatan', price: 5.29 },
      { store_name: 'Spar', price: 5.19 }
    ]
  },
  {
    id: 5,
    name: 'Bagietka francuska',
    description: 'Świeża bagietka 250g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥖',
    prices: [
      { store_name: 'Biedronka', price: 1.89 },
      { store_name: 'LIDL', price: 1.69, is_promotion: true, discount_percentage: 15 },
      { store_name: 'Carrefour', price: 2.09 },
      { store_name: 'Netto', price: 1.79 },
      { store_name: 'Tesco', price: 1.95 },
      { store_name: 'Auchan', price: 1.99 },
      { store_name: 'Dino', price: 1.85 },
      { store_name: 'Stokrotka', price: 1.89 },
      { store_name: 'Polomarket', price: 2.05 },
      { store_name: 'Freshmarket', price: 2.15 },
      { store_name: 'Lewiatan', price: 2.09 },
      { store_name: 'Spar', price: 1.99 }
    ]
  },
  {
    id: 6,
    name: 'Bagietka z ziarnami',
    description: 'Bagietka wieloziarnista 300g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥖',
    prices: [
      { store_name: 'Biedronka', price: 2.19 },
      { store_name: 'LIDL', price: 1.99 },
      { store_name: 'Dino', price: 2.29 },
      { store_name: 'Netto', price: 2.09 },
      { store_name: 'Tesco', price: 2.25 },
      { store_name: 'Carrefour', price: 2.39 },
      { store_name: 'Stokrotka', price: 2.15 },
      { store_name: 'Auchan', price: 2.19 },
      { store_name: 'Polomarket', price: 2.35 },
      { store_name: 'Freshmarket', price: 2.45 },
      { store_name: 'Lewiatan', price: 2.39 },
      { store_name: 'Spar', price: 2.29 }
    ]
  },
  {
    id: 7,
    name: 'Croissant maślany',
    description: 'Croissant świeży z masłem 80g',
    brand: 'Wrzoszczyn',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥐',
    prices: [
      { store_name: 'Biedronka', price: 2.49 },
      { store_name: 'LIDL', price: 2.29 },
      { store_name: 'Carrefour', price: 2.69 },
      { store_name: 'Żabka', price: 2.89 },
      { store_name: 'Netto', price: 2.39 },
      { store_name: 'Tesco', price: 2.55 },
      { store_name: 'Auchan', price: 2.59 },
      { store_name: 'Dino', price: 2.45 },
      { store_name: 'Stokrotka', price: 2.49 },
      { store_name: 'Polomarket', price: 2.75 },
      { store_name: 'Freshmarket', price: 2.85 },
      { store_name: 'Lewiatan', price: 2.69 }
    ]
  },
  {
    id: 8,
    name: 'Croissant czekoladowy',
    description: 'Croissant z czekoladą 90g',
    brand: 'Wrzoszczyn',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥐',
    prices: [
      { store_name: 'Biedronka', price: 2.79 },
      { store_name: 'LIDL', price: 2.59 },
      { store_name: 'Żabka', price: 3.19 },
      { store_name: 'Netto', price: 2.69 },
      { store_name: 'Tesco', price: 2.85 },
      { store_name: 'Carrefour', price: 2.99 },
      { store_name: 'Auchan', price: 2.89 },
      { store_name: 'Dino', price: 2.75 },
      { store_name: 'Stokrotka', price: 2.79 },
      { store_name: 'Polomarket', price: 3.05 },
      { store_name: 'Freshmarket', price: 3.15 },
      { store_name: 'Lewiatan', price: 2.99 }
    ]
  },
  {
    id: 9,
    name: 'Bułki śniadaniowe',
    description: 'Bułki pszenne 6 sztuk',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥯',
    prices: [
      { store_name: 'Biedronka', price: 3.79 },
      { store_name: 'LIDL', price: 3.49 },
      { store_name: 'Netto', price: 3.99 },
      { store_name: 'Tesco', price: 3.89 },
      { store_name: 'Carrefour', price: 4.09 },
      { store_name: 'Auchan', price: 3.99 },
      { store_name: 'Dino', price: 3.85 },
      { store_name: 'Stokrotka', price: 3.79 },
      { store_name: 'Polomarket', price: 4.15 },
      { store_name: 'Freshmarket', price: 4.25 },
      { store_name: 'Lewiatan', price: 4.09 },
      { store_name: 'Spar', price: 3.99 }
    ]
  },
  {
    id: 10,
    name: 'Bułki hamburgerowe',
    description: 'Bułki do hamburgerów 4szt',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍔',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Carrefour', price: 3.19 },
      { store_name: 'Netto', price: 2.89 },
      { store_name: 'Tesco', price: 3.05 },
      { store_name: 'Auchan', price: 3.09 },
      { store_name: 'Dino', price: 2.95 },
      { store_name: 'Stokrotka', price: 2.99 },
      { store_name: 'Polomarket', price: 3.25 },
      { store_name: 'Freshmarket', price: 3.35 },
      { store_name: 'Lewiatan', price: 3.19 },
      { store_name: 'Spar', price: 3.09 }
    ]
  },
  {
    id: 11,
    name: 'Pierniki toruńskie',
    description: 'Pierniki tradycyjne 200g',
    brand: 'Kopernik',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍪',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.49, is_promotion: true, discount_percentage: 10 },
      { store_name: 'Carrefour', price: 5.29 },
      { store_name: 'Netto', price: 4.79 },
      { store_name: 'Tesco', price: 5.05 },
      { store_name: 'Auchan', price: 5.15 },
      { store_name: 'Dino', price: 4.89 },
      { store_name: 'Stokrotka', price: 4.99 },
      { store_name: 'Polomarket', price: 5.35 },
      { store_name: 'Freshmarket', price: 5.45 },
      { store_name: 'Lewiatan', price: 5.29 },
      { store_name: 'Spar', price: 5.19 }
    ]
  },
  {
    id: 12,
    name: 'Pączki różane',
    description: 'Pączki z różą 4szt',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍩',
    prices: [
      { store_name: 'Biedronka', price: 5.99 },
      { store_name: 'LIDL', price: 5.49 },
      { store_name: 'Żabka', price: 6.49 },
      { store_name: 'Netto', price: 5.79 },
      { store_name: 'Tesco', price: 6.15 },
      { store_name: 'Carrefour', price: 6.29 },
      { store_name: 'Auchan', price: 6.19 },
      { store_name: 'Dino', price: 5.95 },
      { store_name: 'Stokrotka', price: 5.99 },
      { store_name: 'Polomarket', price: 6.45 },
      { store_name: 'Freshmarket', price: 6.55 },
      { store_name: 'Lewiatan', price: 6.29 }
    ]
  },

  // ===== Nabiał (Dairy) - 30 products =====
  {
    id: 13,
    name: 'Mleko 3,2%',
    description: 'Mleko pełnotłuste 1L',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 3.49 },
      { store_name: 'Żabka', price: 3.99 },
      { store_name: 'LIDL', price: 3.29 },
      { store_name: 'Carrefour', price: 3.59 },
      { store_name: 'Netto', price: 3.39 },
      { store_name: 'Tesco', price: 3.55 },
      { store_name: 'Auchan', price: 3.49 },
      { store_name: 'Dino', price: 3.45 },
      { store_name: 'Stokrotka', price: 3.49 },
      { store_name: 'Polomarket', price: 3.75 },
      { store_name: 'Freshmarket', price: 3.85 },
      { store_name: 'Lewiatan', price: 3.59 }
    ]
  },
  {
    id: 14,
    name: 'Ser żółty Gouda plastry 150g',
    description: 'Ser żółty Gouda plastry 150g',
    brand: 'Hochland',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🧀',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.59, is_promotion: true, discount_percentage: 12 },
      { store_name: 'Carrefour', price: 5.29 },
      { store_name: 'Netto', price: 4.79 },
      { store_name: 'Tesco', price: 5.05 },
      { store_name: 'Auchan', price: 5.15 },
      { store_name: 'Dino', price: 4.89 },
      { store_name: 'Stokrotka', price: 4.99 },
      { store_name: 'Polomarket', price: 5.35 },
      { store_name: 'Freshmarket', price: 5.45 },
      { store_name: 'Lewiatan', price: 5.29 },
      { store_name: 'Spar', price: 5.19 }
    ]
  },
  {
    id: 15,
    name: 'Jogurt naturalny',
    description: 'Jogurt naturalny 500g',
    brand: 'Danone',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 3.29 },
      { store_name: 'LIDL', price: 2.99, is_promotion: true, discount_percentage: 20 },
      { store_name: 'Rossmann', price: 3.49 },
      { store_name: 'Netto', price: 3.19 },
      { store_name: 'Tesco', price: 3.35 },
      { store_name: 'Carrefour', price: 3.39 },
      { store_name: 'Auchan', price: 3.29 },
      { store_name: 'Dino', price: 3.25 },
      { store_name: 'Stokrotka', price: 3.29 },
      { store_name: 'Polomarket', price: 3.55 },
      { store_name: 'Freshmarket', price: 3.65 },
      { store_name: 'Lewiatan', price: 3.39 }
    ]
  },
  {
    id: 16,
    name: 'Masło extra',
    description: 'Masło słodkosmetankowe 200g',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🧈',
    prices: [
      { store_name: 'Biedronka', price: 5.99 },
      { store_name: 'LIDL', price: 5.49 },
      { store_name: 'Carrefour', price: 6.29 },
      { store_name: 'Auchan', price: 6.09 },
      { store_name: 'Netto', price: 5.79 },
      { store_name: 'Tesco', price: 6.05 },
      { store_name: 'Dino', price: 5.89 },
      { store_name: 'Stokrotka', price: 5.99 },
      { store_name: 'Polomarket', price: 6.35 },
      { store_name: 'Freshmarket', price: 6.45 },
      { store_name: 'Lewiatan', price: 6.29 },
      { store_name: 'Spar', price: 6.19 }
    ]
  },
  {
    id: 17,
    name: 'Twaróg ziarnisty',
    description: 'Twaróg ziarnisty 250g',
    brand: 'Bakoma',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 3.79 },
      { store_name: 'LIDL', price: 3.49 },
      { store_name: 'Carrefour', price: 3.99 },
      { store_name: 'Netto', price: 3.69 },
      { store_name: 'Tesco', price: 3.85 },
      { store_name: 'Auchan', price: 3.89 },
      { store_name: 'Dino', price: 3.75 },
      { store_name: 'Stokrotka', price: 3.79 },
      { store_name: 'Polomarket', price: 4.05 },
      { store_name: 'Freshmarket', price: 4.15 },
      { store_name: 'Lewiatan', price: 3.99 },
      { store_name: 'Spar', price: 3.89 }
    ]
  },
  {
    id: 18,
    name: 'Śmietana 18%',
    description: 'Śmietana do kawy 200ml',
    brand: 'Łaciate',
    category_id: 2,
    category_name: 'Nabiał',
    category_icon: '🥛',
    prices: [
      { store_name: 'Biedronka', price: 2.99 },
      { store_name: 'LIDL', price: 2.79 },
      { store_name: 'Żabka', price: 3.29 },
      { store_name: 'Netto', price: 2.89 },
      { store_name: 'Tesco', price: 3.05 },
      { store_name: 'Carrefour', price: 3.09 },
      { store_name: 'Auchan', price: 2.99 },
      { store_name: 'Dino', price: 2.95 },
      { store_name: 'Stokrotka', price: 2.99 },
      { store_name: 'Polomarket', price: 3.25 },
      { store_name: 'Freshmarket', price: 3.35 },
      { store_name: 'Lewiatan', price: 3.09 }
    ]
  },

  // ===== Mięso i ryby (Meat & Fish) - 25 products =====
  {
    id: 19,
    name: 'Kurczak cały',
    description: 'Kurczak świeży cały 1kg',
    brand: 'Drob-Pol',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🍗',
    prices: [
      { store_name: 'Biedronka', price: 8.99 },
      { store_name: 'LIDL', price: 7.99, is_promotion: true, discount_percentage: 20 },
      { store_name: 'Auchan', price: 9.49 },
      { store_name: 'Carrefour', price: 9.29 },
      { store_name: 'Netto', price: 8.79 },
      { store_name: 'Tesco', price: 9.15 },
      { store_name: 'Dino', price: 8.89 },
      { store_name: 'Stokrotka', price: 8.99 },
      { store_name: 'Polomarket', price: 9.55 },
      { store_name: 'Freshmarket', price: 9.65 },
      { store_name: 'Lewiatan', price: 9.29 },
      { store_name: 'Spar', price: 9.19 }
    ]
  },
  {
    id: 20,
    name: 'Kiełbasa krakowska',
    description: 'Kiełbasa krakowska sucha 200g',
    brand: 'Sokołów',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🌭',
    prices: [
      { store_name: 'Biedronka', price: 6.99 },
      { store_name: 'LIDL', price: 6.49 },
      { store_name: 'Carrefour', price: 7.29 },
      { store_name: 'Netto', price: 6.79 },
      { store_name: 'Tesco', price: 7.05 },
      { store_name: 'Auchan', price: 7.19 },
      { store_name: 'Dino', price: 6.89 },
      { store_name: 'Stokrotka', price: 6.99 },
      { store_name: 'Polomarket', price: 7.35 },
      { store_name: 'Freshmarket', price: 7.45 },
      { store_name: 'Lewiatan', price: 7.29 },
      { store_name: 'Spar', price: 7.19 }
    ]
  },
  {
    id: 21,
    name: 'Łosoś filet',
    description: 'Łosoś norweski filet 300g',
    brand: 'Morpol',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🐟',
    prices: [
      { store_name: 'Biedronka', price: 18.99 },
      { store_name: 'LIDL', price: 17.99 },
      { store_name: 'Carrefour', price: 19.49 },
      { store_name: 'Netto', price: 18.79 },
      { store_name: 'Tesco', price: 19.15 },
      { store_name: 'Auchan', price: 19.29 },
      { store_name: 'Dino', price: 18.89 },
      { store_name: 'Stokrotka', price: 18.99 },
      { store_name: 'Polomarket', price: 19.65 },
      { store_name: 'Freshmarket', price: 19.75 },
      { store_name: 'Lewiatan', price: 19.49 },
      { store_name: 'Spar', price: 19.39 }
    ]
  },
  {
    id: 22,
    name: 'Mięso mielone wołowe',
    description: 'Mięso mielone wołowe 500g',
    brand: 'Sokołów',
    category_id: 3,
    category_name: 'Mięso i ryby',
    category_icon: '🥩',
    prices: [
      { store_name: 'Biedronka', price: 12.99 },
      { store_name: 'LIDL', price: 11.99, is_promotion: true, discount_percentage: 15 },
      { store_name: 'Auchan', price: 13.49 },
      { store_name: 'Netto', price: 12.79 },
      { store_name: 'Tesco', price: 13.15 },
      { store_name: 'Carrefour', price: 13.29 },
      { store_name: 'Dino', price: 12.89 },
      { store_name: 'Stokrotka', price: 12.99 },
      { store_name: 'Polomarket', price: 13.55 },
      { store_name: 'Freshmarket', price: 13.65 },
      { store_name: 'Lewiatan', price: 13.29 },
      { store_name: 'Spar', price: 13.19 }
    ]
  },

  // ===== Warzywa (Vegetables) - Adding more variety =====
  {
    id: 23,
    name: 'Ziemniaki',
    description: 'Ziemniaki białe 2kg',
    brand: 'Lokalny Producent',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥔',
    prices: [
      { store_name: 'Biedronka', price: 3.99 },
      { store_name: 'LIDL', price: 3.49, is_promotion: true, discount_percentage: 15 },
      { store_name: 'Auchan', price: 4.19 },
      { store_name: 'Netto', price: 3.79 },
      { store_name: 'Tesco', price: 4.05 },
      { store_name: 'Carrefour', price: 4.09 },
      { store_name: 'Dino', price: 3.89 },
      { store_name: 'Stokrotka', price: 3.99 },
      { store_name: 'Polomarket', price: 4.25 },
      { store_name: 'Freshmarket', price: 4.35 },
      { store_name: 'Lewiatan', price: 4.09 },
      { store_name: 'Spar', price: 3.99 }
    ]
  },
  {
    id: 24,
    name: 'Ziemniaki młode',
    description: 'Ziemniaki młode 1kg',
    brand: 'Lokalny Producent',
    category_id: 4,
    category_name: 'Warzywa',
    category_icon: '🥔',
    prices: [
      { store_name: 'Biedronka', price: 4.99 },
      { store_name: 'LIDL', price: 4.69 },
      { store_name: 'Carrefour', price: 5.19 },
      { store_name: 'Netto', price: 4.89 },
      { store_name: 'Tesco', price: 5.05 },
      { store_name: 'Auchan', price: 5.09 },
      { store_name: 'Dino', price: 4.95 },
      { store_name: 'Stokrotka', price: 4.99 },
      { store_name: 'Polomarket', price: 5.25 },
      { store_name: 'Freshmarket', price: 5.35 },
      { store_name: 'Lewiatan', price: 5.19 },
      { store_name: 'Spar', price: 5.09 }
    ]
  },
  // Continue with more products following this pattern...
];

// Enhanced product database with new categories
const enhancedProducts = [
  // ===== Existing food categories (1-13) =====
  ...sampleProducts,
  
  // ===== Category 14: Furniture & Home (Meble i Dom) =====
  {
    id: 71,
    name: 'Regał Billy',
    description: 'Regał na książki 80x28x202 cm',
    brand: 'IKEA',
    category_id: 14,
    category_name: 'Meble i Dom',
    category_icon: '🏠',
    prices: [
      { store_name: 'IKEA', price: 89.00 },
      { store_name: 'Jysk', price: 95.00 },
      { store_name: 'Black Red White', price: 92.00 }
    ]
  },
  {
    id: 72,
    name: 'Fotel Poäng',
    description: 'Fotel bujany z podłokietnikami',
    brand: 'IKEA',
    category_id: 14,
    category_name: 'Meble i Dom',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 299.00 },
      { store_name: 'Jysk', price: 320.00 },
      { store_name: 'Black Red White', price: 310.00 }
    ]
  },
  {
    id: 73,
    name: 'Szafa Malm',
    description: 'Szafa 3-drzwiowa 150x201 cm',
    brand: 'IKEA',
    category_id: 14,
    category_name: 'Meble i Dom',
    category_icon: '🚪',
    prices: [
      { store_name: 'IKEA', price: 449.00 },
      { store_name: 'Black Red White', price: 480.00 },
      { store_name: 'Jysk', price: 465.00 }
    ]
  },
  {
    id: 74,
    name: 'Stolik Lack',
    description: 'Stolik kawowy 90x55 cm',
    brand: 'IKEA',
    category_id: 14,
    category_name: 'Meble i Dom',
    category_icon: '🪑',
    prices: [
      { store_name: 'IKEA', price: 49.00 },
      { store_name: 'Jysk', price: 55.00 },
      { store_name: 'Black Red White', price: 52.00 }
    ]
  },
  {
    id: 75,
    name: 'Wiertarka',
    description: 'Wiertarka udarowa 18V',
    brand: 'Bosch',
    category_id: 14,
    category_name: 'Meble i Dom',
    category_icon: '🔨',
    prices: [
      { store_name: 'Leroy Merlin', price: 299.00 },
      { store_name: 'Castorama', price: 310.00 },
      { store_name: 'OBI', price: 305.00 }
    ]
  },

  // ===== Category 15: Electronics (Elektronika) =====
  {
    id: 76,
    name: 'Smartphone Galaxy',
    description: 'Samsung Galaxy A54 128GB',
    brand: 'Samsung',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 1299.00 },
      { store_name: 'RTV Euro AGD', price: 1320.00 },
      { store_name: 'Neo24', price: 1310.00 }
    ]
  },
  {
    id: 77,
    name: 'Laptop',
    description: 'Laptop Lenovo IdeaPad 15.6"',
    brand: 'Lenovo',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '💻',
    prices: [
      { store_name: 'Media Markt', price: 2199.00 },
      { store_name: 'Saturn', price: 2250.00 },
      { store_name: 'RTV Euro AGD', price: 2220.00 }
    ]
  },

  // ===== Category 16: Clothing (Odzież) =====
  {
    id: 78,
    name: 'T-shirt bawełniany',
    description: 'T-shirt męski 100% bawełna',
    brand: 'H&M',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👕',
    prices: [
      { store_name: 'H&M', price: 29.99 },
      { store_name: 'Reserved', price: 35.99 },
      { store_name: 'Pepco', price: 19.99 }
    ]
  },
  {
    id: 79,
    name: 'Buty sportowe',
    description: 'Buty do biegania męskie',
    brand: 'Nike',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👟',
    prices: [
      { store_name: 'CCC', price: 299.00 },
      { store_name: 'Deichmann', price: 320.00 },
      { store_name: 'Decathlon', price: 280.00 }
    ]
  },

  // ===== Category 17: Books (Książki) =====
  {
    id: 80,
    name: 'Książka bestseller',
    description: 'Bestseller roku - powieść',
    brand: 'Wydawnictwo',
    category_id: 17,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 39.99 },
      { store_name: 'Matras', price: 42.99 }
    ]
  },

  // ===== Category 18: Sports (Sport) =====
  {
    id: 81,
    name: 'Piłka nożna',
    description: 'Piłka nożna rozmiar 5',
    brand: 'Adidas',
    category_id: 18,
    category_name: 'Sport',
    category_icon: '⚽',
    prices: [
      { store_name: 'Decathlon', price: 89.99 },
      { store_name: 'Go Sport', price: 95.99 }
    ]
  },

  // ===== Category 19: Petrol & Car (Paliwo i Samochód) =====
  {
    id: 82,
    name: 'Benzyna 95',
    description: 'Benzyna bezołowiowa 95 - 1L',
    brand: 'Shell',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '⛽',
    prices: [
      { store_name: 'Shell', price: 6.29 },
      { store_name: 'BP', price: 6.25 },
      { store_name: 'Orlen', price: 6.19, is_promotion: true, discount_percentage: 5 }
    ]
  },
  {
    id: 83,
    name: 'Diesel',
    description: 'Olej napędowy - 1L',
    brand: 'BP',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '⛽',
    prices: [
      { store_name: 'BP', price: 6.09 },
      { store_name: 'Shell', price: 6.15 },
      { store_name: 'Orlen', price: 5.99, is_promotion: true, discount_percentage: 3 }
    ]
  },
  {
    id: 84,
    name: 'Motor yağı 5W-30',
    description: 'Syntetik motor yağı 4L',
    brand: 'Castrol',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '🛢️',
    prices: [
      { store_name: 'Orlen', price: 179.99 },
      { store_name: 'Shell', price: 189.99 },
      { store_name: 'BP', price: 185.99 }
    ]
  },
  {
    id: 85,
    name: 'Araba kokusu',
    description: 'Zapach samochodowy wanilia',
    brand: 'Little Trees',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '🌲',
    prices: [
      { store_name: 'Orlen', price: 12.99 },
      { store_name: 'Shell', price: 14.99 },
      { store_name: 'BP', price: 13.99 },
      { store_name: 'Żabka', price: 15.99 }
    ]
  },
  {
    id: 86,
    name: 'Cam suyu',
    description: 'Płyn do spryskiwaczy -20°C 2L',
    brand: 'K2',
    category_id: 19,
    category_name: 'Paliwo i Samochód',
    category_icon: '💧',
    prices: [
      { store_name: 'Orlen', price: 8.99 },
      { store_name: 'Shell', price: 9.99 },
      { store_name: 'BP', price: 9.49 }
    ]
  },

  // ===== Energy Drinks for Petrol Stations & Supermarkets =====
  {
    id: 87,
    name: 'Red Bull',
    description: 'Napój energetyczny 250ml',
    brand: 'Red Bull',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Shell', price: 6.99 },
      { store_name: 'BP', price: 6.89 },
      { store_name: 'Orlen', price: 6.79 },
      { store_name: 'Żabka', price: 7.49 },
      { store_name: 'Biedronka', price: 5.99, is_promotion: true, discount_percentage: 20 },
      { store_name: 'LIDL', price: 6.29 },
      { store_name: 'Carrefour', price: 6.99 },
      { store_name: 'Netto', price: 6.49 }
    ]
  },
  {
    id: 88,
    name: 'Monster Energy',
    description: 'Napój energetyczny 500ml',
    brand: 'Monster',
    category_id: 6,
    category_name: 'Napoje',
    category_icon: '🥤',
    prices: [
      { store_name: 'Shell', price: 8.99 },
      { store_name: 'BP', price: 8.79 },
      { store_name: 'Orlen', price: 8.49 },
      { store_name: 'Żabka', price: 9.49 },
      { store_name: 'Biedronka', price: 7.99 },
      { store_name: 'LIDL', price: 8.29 },
      { store_name: 'Tesco', price: 8.99 }
    ]
  },

  // ===== More Sports Equipment for Decathlon =====
  {
    id: 89,
    name: 'Kamp çadırı',
    description: 'Namiot turystyczny 3-osobowy',
    brand: 'Quechua',
    category_id: 18,
    category_name: 'Sport',
    category_icon: '🏕️',
    prices: [
      { store_name: 'Decathlon', price: 299.99 },
      { store_name: 'Go Sport', price: 320.00 }
    ]
  },
  {
    id: 90,
    name: 'Uyku tulumu',
    description: 'Śpiwór turystyczny -5°C',
    brand: 'Forclaz',
    category_id: 18,
    category_name: 'Sport',
    category_icon: '🛏️',
    prices: [
      { store_name: 'Decathlon', price: 159.99 },
      { store_name: 'Go Sport', price: 179.99 }
    ]
  },
  {
    id: 91,
    name: 'Güneş gözlüğü',
    description: 'Okulary przeciwsłoneczne UV400',
    brand: 'Solognac',
    category_id: 18,
    category_name: 'Sport',
    category_icon: '🕶️',
    prices: [
      { store_name: 'Decathlon', price: 49.99 },
      { store_name: 'Go Sport', price: 59.99 },
      { store_name: 'Reserved', price: 79.99 },
      { store_name: 'H&M', price: 39.99 }
    ]
  },
  {
    id: 92,
    name: 'Spor ayakkabısı',
    description: 'Buty do biegania męskie',
    brand: 'Kalenji',
    category_id: 18,
    category_name: 'Sport',
    category_icon: '👟',
    prices: [
      { store_name: 'Decathlon', price: 129.99, is_promotion: true, discount_percentage: 25 },
      { store_name: 'Go Sport', price: 149.99 },
      { store_name: 'CCC', price: 139.99 },
      { store_name: 'Deichmann', price: 144.99 }
    ]
  },

  // ===== Shoe Store Products =====
  {
    id: 93,
    name: 'Casual ayakkabı',
    description: 'Buty casual męskie skórzane',
    brand: 'CCC',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👞',
    prices: [
      { store_name: 'CCC', price: 199.99 },
      { store_name: 'Deichmann', price: 219.99 }
    ]
  },
  {
    id: 94,
    name: 'Kadın topuklu',
    description: 'Szpilki damskie 8cm',
    brand: 'Deichmann',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👠',
    prices: [
      { store_name: 'Deichmann', price: 149.99 },
      { store_name: 'CCC', price: 159.99 }
    ]
  },
  {
    id: 95,
    name: 'Çocuk ayakkabısı',
    description: 'Buty dziecięce kolorowe',
    brand: 'CCC',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👟',
    prices: [
      { store_name: 'CCC', price: 89.99 },
      { store_name: 'Deichmann', price: 94.99 },
      { store_name: 'Decathlon', price: 79.99 }
    ]
  },

  // ===== Clothing Store Products =====
  {
    id: 96,
    name: 'Erkek gömlek',
    description: 'Koszula męska biznesowa',
    brand: 'Reserved',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👔',
    prices: [
      { store_name: 'Reserved', price: 89.99 },
      { store_name: 'H&M', price: 69.99, is_promotion: true, discount_percentage: 30 }
    ]
  },
  {
    id: 97,
    name: 'Kadın elbise',
    description: 'Sukienka damska letnia',
    brand: 'H&M',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👗',
    prices: [
      { store_name: 'H&M', price: 79.99 },
      { store_name: 'Reserved', price: 99.99 },
      { store_name: 'Pepco', price: 49.99 }
    ]
  },
  {
    id: 98,
    name: 'Çocuk tişört',
    description: 'T-shirt dziecięcy bawełniany',
    brand: 'Pepco',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👕',
    prices: [
      { store_name: 'Pepco', price: 14.99 },
      { store_name: 'H&M', price: 19.99 },
      { store_name: 'Reserved', price: 24.99 }
    ]
  },
  {
    id: 99,
    name: 'Kot pantolon',
    description: 'Spodnie jeansowe męskie',
    brand: 'Reserved',
    category_id: 16,
    category_name: 'Odzież',
    category_icon: '👖',
    prices: [
      { store_name: 'Reserved', price: 129.99 },
      { store_name: 'H&M', price: 99.99 },
      { store_name: 'Pepco', price: 79.99 }
    ]
  },

  // ===== Electronics Store Products =====
  {
    id: 100,
    name: 'iPhone 15',
    description: 'Apple iPhone 15 128GB',
    brand: 'Apple',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '📱',
    prices: [
      { store_name: 'Media Markt', price: 3799.00 },
      { store_name: 'RTV Euro AGD', price: 3829.00 },
      { store_name: 'Neo24', price: 3789.00, is_promotion: true, discount_percentage: 2 }
    ]
  },
  {
    id: 101,
    name: 'PlayStation 5',
    description: 'Konsola Sony PS5 825GB',
    brand: 'Sony',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '🎮',
    prices: [
      { store_name: 'Media Markt', price: 2299.00 },
      { store_name: 'Saturn', price: 2349.00 },
      { store_name: 'RTV Euro AGD', price: 2279.00 },
      { store_name: 'Empik', price: 2329.00 }
    ]
  },
  {
    id: 102,
    name: 'Çamaşır makinesi',
    description: 'Pralka automatyczna 8kg A+++',
    brand: 'Samsung',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '🌀',
    prices: [
      { store_name: 'Media Markt', price: 1899.00 },
      { store_name: 'RTV Euro AGD', price: 1849.00, is_promotion: true, discount_percentage: 10 },
      { store_name: 'Saturn', price: 1929.00 }
    ]
  },
  {
    id: 103,
    name: 'Klima',
    description: 'Klimatyzator split 3.5kW',
    brand: 'LG',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '❄️',
    prices: [
      { store_name: 'Media Markt', price: 2199.00 },
      { store_name: 'RTV Euro AGD', price: 2149.00 },
      { store_name: 'Saturn', price: 2249.00 }
    ]
  },
  {
    id: 104,
    name: 'Xbox Series X',
    description: 'Konsola Microsoft Xbox Series X 1TB',
    brand: 'Microsoft',
    category_id: 15,
    category_name: 'Elektronika',
    category_icon: '🎮',
    prices: [
      { store_name: 'Media Markt', price: 2199.00 },
      { store_name: 'Saturn', price: 2229.00 },
      { store_name: 'RTV Euro AGD', price: 2179.00 },
      { store_name: 'Empik', price: 2219.00 }
    ]
  },

  // ===== Bookstore Products =====
  {
    id: 105,
    name: 'Witcher kitabı',
    description: 'Wiedźmin - Ostatnie życzenie',
    brand: 'SuperNowa',
    category_id: 17,
    category_name: 'Książki',
    category_icon: '📚',
    prices: [
      { store_name: 'Empik', price: 34.99 },
      { store_name: 'Matras', price: 32.99, is_promotion: true, discount_percentage: 15 }
    ]
  },
  {
    id: 106,
    name: 'Masa oyunu Monopoly',
    description: 'Monopoly Classic wersja polska',
    brand: 'Hasbro',
    category_id: 17,
    category_name: 'Książki',
    category_icon: '🎲',
    prices: [
      { store_name: 'Empik', price: 129.99 },
      { store_name: 'Matras', price: 124.99 }
    ]
  },
  {
    id: 107,
    name: 'Nintendo Switch',
    description: 'Konsola Nintendo Switch OLED',
    brand: 'Nintendo',
    category_id: 17,
    category_name: 'Książki',
    category_icon: '🎮',
    prices: [
      { store_name: 'Empik', price: 1599.00 },
      { store_name: 'Media Markt', price: 1649.00 },
      { store_name: 'RTV Euro AGD', price: 1579.00, is_promotion: true, discount_percentage: 5 }
    ]
  },
  {
    id: 108,
    name: 'Scrabble',
    description: 'Gra słowna Scrabble po polsku',
    brand: 'Mattel',
    category_id: 17,
    category_name: 'Książki',
    category_icon: '🔤',
    prices: [
      { store_name: 'Empik', price: 89.99 },
      { store_name: 'Matras', price: 84.99 }
    ]
  },

  // ===== Bread for Petrol Stations =====
  {
    id: 109,
    name: 'Sandviç ekmeği',
    description: 'Chleb tostowy świeży 500g',
    brand: 'Putka',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🍞',
    prices: [
      { store_name: 'Shell', price: 4.49 },
      { store_name: 'BP', price: 4.39 },
      { store_name: 'Orlen', price: 4.29 },
      { store_name: 'Żabka', price: 4.99 },
      { store_name: 'Biedronka', price: 3.79 },
      { store_name: 'LIDL', price: 3.59 }
    ]
  },
  {
    id: 110,
    name: 'Sıcak sandviç',
    description: 'Kanapka grillowana z szynką',
    brand: 'Fresh',
    category_id: 1,
    category_name: 'Pieczywo',
    category_icon: '🥪',
    prices: [
      { store_name: 'Shell', price: 12.99 },
      { store_name: 'BP', price: 12.49 },
      { store_name: 'Orlen', price: 11.99 },
      { store_name: 'Żabka', price: 13.99 }
    ]
  }
];

// Updated categories list
const enhancedCategories = [
  { id: 1, name: 'bread', name_pl: 'Pieczywo', icon: '🍞', product_count: 14 },
  { id: 2, name: 'dairy', name_pl: 'Nabiał', icon: '🥛', product_count: 6 },
  { id: 3, name: 'meat', name_pl: 'Mięso i ryby', icon: '🥩', product_count: 4 },
  { id: 4, name: 'vegetables', name_pl: 'Warzywa', icon: '🥕', product_count: 2 },
  { id: 5, name: 'fruits', name_pl: 'Owoce', icon: '🍎', product_count: 0 },
  { id: 6, name: 'drinks', name_pl: 'Napoje', icon: '🥤', product_count: 2 },
  { id: 7, name: 'sweets', name_pl: 'Słodycze', icon: '🍭', product_count: 8 },
  { id: 8, name: 'snacks', name_pl: 'Przekąski', icon: '🍿', product_count: 0 },
  { id: 9, name: 'frozen', name_pl: 'Mrożonki', icon: '🧊', product_count: 0 },
  { id: 10, name: 'spices', name_pl: 'Przyprawy', icon: '🧂', product_count: 0 },
  { id: 11, name: 'household', name_pl: 'Chemia gospodarcza', icon: '🧽', product_count: 0 },
  { id: 12, name: 'hygiene', name_pl: 'Higiena osobista', icon: '🧴', product_count: 0 },
  { id: 13, name: 'baby', name_pl: 'Artykuły dla dzieci', icon: '🍼', product_count: 0 },
  { id: 14, name: 'furniture', name_pl: 'Meble i Dom', icon: '🏠', product_count: 5 },
  { id: 15, name: 'electronics', name_pl: 'Elektronika', icon: '📱', product_count: 7 },
  { id: 16, name: 'clothing', name_pl: 'Odzież', icon: '👕', product_count: 8 },
  { id: 17, name: 'books', name_pl: 'Książki', icon: '📚', product_count: 5 },
  { id: 18, name: 'sports', name_pl: 'Sport', icon: '⚽', product_count: 5 },
  { id: 19, name: 'petrol', name_pl: 'Paliwo i Samochód', icon: '⛽', product_count: 5 }
];

// Expanded stores list with Polish chains - MOVED BEFORE FUNCTION CALL
const stores = [
  // Major discount chains
  { id: 1, name: 'Biedronka', type: 'discount', website: 'https://www.biedronka.pl', categories: ['fruits', 'bread', 'dairy', 'meat', 'vegetables', 'drinks', 'sweets'], location_count: 3000, logo: '🔴' },
  { id: 2, name: 'LIDL', type: 'discount', website: 'https://www.lidl.pl', categories: ['organic', 'bread', 'meat', 'dairy', 'fruits', 'vegetables'], location_count: 800, logo: '🔵' },
  { id: 3, name: 'Netto', type: 'discount', website: 'https://www.netto.pl', categories: ['fruits', 'vegetables', 'dairy'], location_count: 400, logo: '🟡' },
  { id: 4, name: 'Dino', type: 'discount', website: 'https://www.dino.pl', categories: ['local', 'fresh', 'meat', 'dairy'], location_count: 2000, logo: '🦕' },
  { id: 5, name: 'Stokrotka', type: 'discount', website: 'https://www.stokrotka.pl', categories: ['daily', 'fresh', 'dairy'], location_count: 700, logo: '🌼' },
  { id: 6, name: 'Polomarket', type: 'discount', website: 'https://www.polomarket.pl', categories: ['local', 'meat', 'dairy'], location_count: 280, logo: '🔷' },
  
  // Hypermarkets
  { id: 7, name: 'Carrefour', type: 'hypermarket', website: 'https://www.carrefour.pl', categories: ['food', 'electronics', 'clothing', 'household'], location_count: 90, logo: '🛒' },
  { id: 8, name: 'Auchan', type: 'hypermarket', website: 'https://www.auchan.pl', categories: ['electronics', 'clothing', 'home', 'food', 'frozen'], location_count: 90, logo: '🏪' },
  { id: 9, name: 'Tesco', type: 'hypermarket', website: 'https://www.tesco.pl', categories: ['food', 'household', 'electronics'], location_count: 450, logo: '🔴' },
  { id: 10, name: 'Real', type: 'hypermarket', website: 'https://www.real.de', categories: ['food', 'household', 'clothing'], location_count: 50, logo: '🟢' },
  { id: 11, name: 'Kaufland', type: 'hypermarket', website: 'https://www.kaufland.pl', categories: ['food', 'household', 'electronics'], location_count: 240, logo: '🔴' },
  { id: 12, name: 'E.Leclerc', type: 'hypermarket', website: 'https://www.e-leclerc.pl', categories: ['food', 'electronics', 'automotive'], location_count: 25, logo: '🟠' },
  
  // Convenience stores
  { id: 13, name: 'Żabka', type: 'convenience', website: 'https://www.zabka.pl', categories: ['snacks', 'drinks', 'sweets', 'dairy'], location_count: 8000, logo: '🐸' },
  { id: 14, name: 'Freshmarket', type: 'convenience', website: 'https://www.freshmarket.pl', categories: ['fresh', 'daily', 'convenience'], location_count: 190, logo: '🥬' },
  { id: 15, name: 'Lewiatan', type: 'convenience', website: 'https://www.lewiatan.pl', categories: ['local', 'daily', 'convenience'], location_count: 3000, logo: '⚓' },
  { id: 16, name: 'Spar', type: 'convenience', website: 'https://www.spar.pl', categories: ['international', 'convenience'], location_count: 120, logo: '🌟' },
  { id: 17, name: 'Delikatesy Centrum', type: 'convenience', website: 'https://www.dc.pl', categories: ['premium', 'delicatessen'], location_count: 350, logo: '💎' },
  { id: 18, name: 'Intermarche', type: 'convenience', website: 'https://www.intermarche.pl', categories: ['french', 'gourmet'], location_count: 250, logo: '🇫🇷' },
  
  // Drugstores
  { id: 19, name: 'Rossmann', type: 'drugstore', website: 'https://www.rossmann.pl', categories: ['hygiene', 'baby', 'household', 'sweets'], location_count: 1800, logo: '💊' },
  { id: 20, name: 'Super-Pharm', type: 'drugstore', website: 'https://www.super-pharm.pl', categories: ['pharmacy', 'cosmetics'], location_count: 290, logo: '💉' },
  { id: 21, name: 'Hebe', type: 'drugstore', website: 'https://www.hebe.pl', categories: ['cosmetics', 'perfumes'], location_count: 280, logo: '💄' },
  { id: 22, name: 'Doz.pl', type: 'drugstore', website: 'https://www.doz.pl', categories: ['pharmacy', 'health'], location_count: 170, logo: '🏥' },
  
  // Furniture & Home
  { id: 23, name: 'IKEA', type: 'furniture', website: 'https://www.ikea.com/pl', categories: ['household', 'home', 'kitchen'], location_count: 15, logo: '🏠' },
  { id: 24, name: 'Leroy Merlin', type: 'home_improvement', website: 'https://www.leroymerlin.pl', categories: ['household', 'home', 'garden'], location_count: 80, logo: '🔨' },
  { id: 25, name: 'Castorama', type: 'home_improvement', website: 'https://www.castorama.pl', categories: ['diy', 'garden', 'tools'], location_count: 75, logo: '🛠️' },
  { id: 26, name: 'OBI', type: 'home_improvement', website: 'https://www.obi.pl', categories: ['garden', 'tools', 'building'], location_count: 65, logo: '🧰' },
  { id: 27, name: 'Jysk', type: 'furniture', website: 'https://www.jysk.pl', categories: ['furniture', 'home', 'bedding'], location_count: 180, logo: '🛏️' },
  { id: 28, name: 'Black Red White', type: 'furniture', website: 'https://www.brw.pl', categories: ['furniture', 'bedroom', 'living'], location_count: 120, logo: '⚫' },
  
  // Specialized stores
  { id: 29, name: 'Pepco', type: 'retail', website: 'https://www.pepco.pl', categories: ['clothing', 'household', 'toys'], location_count: 600, logo: '🎯' },
  { id: 30, name: 'Action', type: 'retail', website: 'https://www.action.com/pl', categories: ['household', 'toys', 'seasonal'], location_count: 200, logo: '💥' },
  { id: 31, name: 'TEDi', type: 'retail', website: 'https://www.tedi.com', categories: ['household', 'decoration', 'toys'], location_count: 180, logo: '🧸' },
  { id: 32, name: 'Dealz', type: 'retail', website: 'https://www.dealz.ie', categories: ['household', 'toys', 'stationery'], location_count: 50, logo: '💰' },
  
  // Electronics
  { id: 33, name: 'Media Markt', type: 'electronics', website: 'https://www.mediamarkt.pl', categories: ['electronics', 'appliances'], location_count: 35, logo: '📱' },
  { id: 34, name: 'Saturn', type: 'electronics', website: 'https://www.saturn.pl', categories: ['electronics', 'gaming'], location_count: 8, logo: '🪐' },
  { id: 35, name: 'RTV Euro AGD', type: 'electronics', website: 'https://www.euro.com.pl', categories: ['electronics', 'appliances'], location_count: 350, logo: '📺' },
  { id: 36, name: 'Neo24', type: 'electronics', website: 'https://www.neo24.pl', categories: ['electronics', 'mobile'], location_count: 180, logo: '📲' },
  
  // Clothing
  { id: 37, name: 'H&M', type: 'clothing', website: 'https://www.hm.com/pl', categories: ['fashion', 'clothing'], location_count: 120, logo: '👕' },
  { id: 38, name: 'Reserved', type: 'clothing', website: 'https://www.reserved.com/pl', categories: ['fashion', 'polish'], location_count: 250, logo: '🇵🇱' },
  { id: 39, name: 'CCC', type: 'shoes', website: 'https://www.ccc.eu', categories: ['shoes', 'accessories'], location_count: 400, logo: '👟' },
  { id: 40, name: 'Deichmann', type: 'shoes', website: 'https://www.deichmann.com/pl', categories: ['shoes', 'bags'], location_count: 200, logo: '👠' },
  
  // Bookstores & Culture
  { id: 41, name: 'Empik', type: 'bookstore', website: 'https://www.empik.com', categories: ['books', 'music', 'electronics'], location_count: 250, logo: '📚' },
  { id: 42, name: 'Matras', type: 'bookstore', website: 'https://www.matras.pl', categories: ['books', 'stationery'], location_count: 80, logo: '📖' },
  
  // Sports
  { id: 43, name: 'Decathlon', type: 'sports', website: 'https://www.decathlon.pl', categories: ['sports', 'outdoor'], location_count: 50, logo: '⚽' },
  { id: 44, name: 'Go Sport', type: 'sports', website: 'https://www.gosport.pl', categories: ['sports', 'fitness'], location_count: 45, logo: '🏃' },
  
  // Pharmacies
  { id: 45, name: 'Apteka Gemini', type: 'pharmacy', website: 'https://www.gemini.pl', categories: ['pharmacy', 'health'], location_count: 1200, logo: '💊' },
  { id: 46, name: 'Ziko Apteka', type: 'pharmacy', website: 'https://www.ziko.pl', categories: ['pharmacy', 'health'], location_count: 800, logo: '⚕️' },
  { id: 47, name: 'Apteka DOZ', type: 'pharmacy', website: 'https://www.doz.pl', categories: ['pharmacy', 'supplements'], location_count: 400, logo: '🏥' },
  
  // Petrol stations with shops
  { id: 48, name: 'Orlen', type: 'petrol', website: 'https://www.orlen.pl', categories: ['fuel', 'convenience', 'coffee'], location_count: 2800, logo: '⛽' },
  { id: 49, name: 'BP', type: 'petrol', website: 'https://www.bp.com/pl', categories: ['fuel', 'convenience'], location_count: 500, logo: '🟢' },
  { id: 50, name: 'Shell', type: 'petrol', website: 'https://www.shell.pl', categories: ['fuel', 'convenience'], location_count: 400, logo: '🐚' }
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

// Categories API
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

// New: Trending/Popular products
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