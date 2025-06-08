const polishDishes = [
  {
    id: 1,
    name: "Bigos (Kapusta Kiszona)",
    description: "Geleneksel Polonya lahana yemeği - sauerkraut ile",
    difficulty: "Orta",
    prep_time: "30 min",
    cook_time: "2 saat",
    serves: 4,
    category: "Ana Yemek",
    restaurant_price: 35.00, // PLN
    ingredients: [
      { name: "Kapusta kiszona", amount: "500g", category_id: 2, essential: true },
      { name: "Kielbasa", amount: "300g", category_id: 3, essential: true },
      { name: "Boczek", amount: "200g", category_id: 3, essential: true },
      { name: "Cebula", amount: "2 adet", category_id: 2, essential: true },
      { name: "Marchew", amount: "2 adet", category_id: 2, essential: false },
      { name: "Grzyby suszone", amount: "50g", category_id: 2, essential: false },
      { name: "Pomidory puszkowe", amount: "400g", category_id: 2, essential: true },
      { name: "Olej rzepakowy", amount: "50ml", category_id: 5, essential: true },
      { name: "Liść laurowy", amount: "3 adet", category_id: 8, essential: false },
      { name: "Pieprz czarny", amount: "1 tsp", category_id: 8, essential: true }
    ],
    instructions: [
      "Boczek'i küçük parçalara kesin",
      "Soğanı doğrayın ve kavurun",
      "Sauerkraut'u yıkayıp süzün",
      "Tüm malzemeleri tencerede karıştırın",
      "2 saat kısık ateşte pişirin"
    ]
  },
  {
    id: 2,
    name: "Pierogi Ruskie",
    description: "Patates ve peynirli geleneksel Polonya böreği",
    difficulty: "Zor",
    prep_time: "45 min",
    cook_time: "30 min",
    serves: 4,
    category: "Ana Yemek",
    restaurant_price: 28.00,
    ingredients: [
      { name: "Mąka pszenna", amount: "500g", category_id: 1, essential: true },
      { name: "Jajka", amount: "2 adet", category_id: 4, essential: true },
      { name: "Ziemniaki", amount: "1kg", category_id: 2, essential: true },
      { name: "Twaróg", amount: "250g", category_id: 4, essential: true },
      { name: "Cebula", amount: "3 adet", category_id: 2, essential: true },
      { name: "Masło", amount: "100g", category_id: 4, essential: true },
      { name: "Śmietana", amount: "200ml", category_id: 4, essential: false },
      { name: "Sól", amount: "1 tsp", category_id: 8, essential: true },
      { name: "Pieprz", amount: "1 tsp", category_id: 8, essential: true }
    ],
    instructions: [
      "Hamuru hazırlayın ve dinlendirin",
      "Patates ve twaróg ile iç malzemeyi hazırlayın",
      "Börek paketlerini şekillendirin",
      "Kaynayan suda pişirin",
      "Soğan ile servis edin"
    ]
  },
  {
    id: 3,
    name: "Żurek",
    description: "Ekşi çorba - geleneksel Polonya çorbası",
    difficulty: "Orta",
    prep_time: "20 min",
    cook_time: "40 min",
    serves: 4,
    category: "Çorba",
    restaurant_price: 22.00,
    ingredients: [
      { name: "Żurek starter", amount: "500ml", category_id: 9, essential: true },
      { name: "Kielbasa biała", amount: "400g", category_id: 3, essential: true },
      { name: "Boczek", amount: "150g", category_id: 3, essential: true },
      { name: "Jajka", amount: "4 adet", category_id: 4, essential: true },
      { name: "Czosnek", amount: "4 ząbki", category_id: 2, essential: true },
      { name: "Śmietana", amount: "200ml", category_id: 4, essential: true },
      { name: "Liść laurowy", amount: "2 adet", category_id: 8, essential: false },
      { name: "Majeranek", amount: "1 tsp", category_id: 8, essential: true }
    ],
    instructions: [
      "Boczek ve kielbasa'yı kavurun",
      "Sarımsak ekleyin",
      "Żurek starter ekleyip kaynatın",
      "Krema ekleyin",
      "Haşlanmış yumurta ile servis edin"
    ]
  },
  {
    id: 4,
    name: "Kotlet Schabowy",
    description: "Geleneksel Polonya şnitzeli",
    difficulty: "Kolay",
    prep_time: "15 min",
    cook_time: "20 min",
    serves: 4,
    category: "Ana Yemek",
    restaurant_price: 32.00,
    ingredients: [
      { name: "Schab bez kości", amount: "800g", category_id: 3, essential: true },
      { name: "Jajka", amount: "3 adet", category_id: 4, essential: true },
      { name: "Bułka tarta", amount: "200g", category_id: 1, essential: true },
      { name: "Mąka pszenna", amount: "100g", category_id: 1, essential: true },
      { name: "Olej do smażenia", amount: "200ml", category_id: 5, essential: true },
      { name: "Sól", amount: "1 tsp", category_id: 8, essential: true },
      { name: "Pieprz", amount: "1 tsp", category_id: 8, essential: true },
      { name: "Ziemniaki", amount: "1kg", category_id: 2, essential: false },
      { name: "Kapusta biała", amount: "500g", category_id: 2, essential: false }
    ],
    instructions: [
      "Domuz etini çekiçle inceltir",
      "Tuz ve karabiber ile baharatlayın",
      "Un, yumurta ve galeta unu ile pane edin",
      "Yağda kızartın",
      "Patates ve lahana ile servis edin"
    ]
  },
  {
    id: 5,
    name: "Sernik",
    description: "Geleneksel Polonya cheesecake'i",
    difficulty: "Orta",
    prep_time: "30 min",
    cook_time: "60 min",
    serves: 8,
    category: "Tatlı",
    restaurant_price: 18.00,
    ingredients: [
      { name: "Twaróg", amount: "1kg", category_id: 4, essential: true },
      { name: "Jajka", amount: "6 adet", category_id: 4, essential: true },
      { name: "Cukier", amount: "200g", category_id: 9, essential: true },
      { name: "Masło", amount: "100g", category_id: 4, essential: true },
      { name: "Herbatniki", amount: "200g", category_id: 10, essential: true },
      { name: "Śmietana", amount: "200ml", category_id: 4, essential: true },
      { name: "Wanilia", amount: "1 tsp", category_id: 8, essential: true },
      { name: "Rodzynki", amount: "100g", category_id: 10, essential: false }
    ],
    instructions: [
      "Bisküvi tabanı hazırlayın",
      "Twaróg karışımını hazırlayın",
      "Fırında 180°C'de pişirin",
      "Soğutup servis edin"
    ]
  }
];

class PolishDishesService {
  constructor(productsData) {
    this.dishes = polishDishes;
    this.products = productsData || [];
  }

  // Tüm yemekleri getir
  getAllDishes() {
    return this.dishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      difficulty: dish.difficulty,
      prep_time: dish.prep_time,
      cook_time: dish.cook_time,
      serves: dish.serves,
      category: dish.category,
      restaurant_price: dish.restaurant_price,
      ingredient_count: dish.ingredients.length
    }));
  }

  // Belirli bir yemeği getir
  getDishById(dishId) {
    return this.dishes.find(dish => dish.id === parseInt(dishId));
  }

  // Yemek maliyeti hesaplama
  calculateDishCost(dishId) {
    const dish = this.getDishById(dishId);
    if (!dish) {
      return { error: 'Yemek bulunamadı' };
    }

    const result = {
      dish_info: {
        id: dish.id,
        name: dish.name,
        description: dish.description,
        serves: dish.serves,
        restaurant_price: dish.restaurant_price
      },
      ingredients: [],
      cost_summary: {
        total_cost: 0,
        cost_per_serving: 0,
        restaurant_price: dish.restaurant_price,
        restaurant_price_per_serving: dish.restaurant_price / dish.serves,
        savings: 0,
        savings_percentage: 0
      },
      missing_ingredients: [],
      cheapest_stores: {}
    };

    dish.ingredients.forEach(ingredient => {
      // Ürünü mağazalarda ara
      const matchingProducts = this.findMatchingProducts(ingredient.name);
      
      if (matchingProducts.length > 0) {
        // En ucuz fiyatları bul
        const bestPrices = this.findBestPrices(matchingProducts);
        const cheapestPrice = Math.min(...bestPrices.map(p => p.price));
        const cheapestStore = bestPrices.find(p => p.price === cheapestPrice);

        result.ingredients.push({
          name: ingredient.name,
          amount: ingredient.amount,
          essential: ingredient.essential,
          found: true,
          cheapest_price: cheapestPrice,
          cheapest_store: cheapestStore.store_name,
          all_prices: bestPrices,
          estimated_cost: this.estimateIngredientCost(cheapestPrice, ingredient.amount)
        });

        result.cost_summary.total_cost += this.estimateIngredientCost(cheapestPrice, ingredient.amount);
      } else {
        // Malzeme bulunamadı - tahmini fiyat
        const estimatedPrice = this.getEstimatedPrice(ingredient.category_id);
        result.missing_ingredients.push({
          name: ingredient.name,
          amount: ingredient.amount,
          essential: ingredient.essential,
          estimated_price: estimatedPrice
        });
        
        if (ingredient.essential) {
          result.cost_summary.total_cost += estimatedPrice;
        }
      }
    });

    // Özet hesaplamalar
    result.cost_summary.cost_per_serving = result.cost_summary.total_cost / dish.serves;
    result.cost_summary.savings = dish.restaurant_price - result.cost_summary.total_cost;
    result.cost_summary.savings_percentage = Math.round(
      (result.cost_summary.savings / dish.restaurant_price) * 100
    );

    // En ucuz mağazaları grupla
    result.cheapest_stores = this.groupByStore(result.ingredients);

    return result;
  }

  // Ürün eşleştirme (fuzzy matching)
  findMatchingProducts(ingredientName) {
    const searchTerms = ingredientName.toLowerCase().split(' ');
    return this.products.filter(product => {
      const productName = product.name.toLowerCase();
      return searchTerms.some(term => productName.includes(term));
    });
  }

  // En iyi fiyatları bul
  findBestPrices(products) {
    const allPrices = [];
    products.forEach(product => {
      product.prices.forEach(price => {
        allPrices.push({
          product_name: product.name,
          store_name: price.store_name,
          price: price.price
        });
      });
    });
    return allPrices.sort((a, b) => a.price - b.price);
  }

  // Malzeme maliyeti tahmini
  estimateIngredientCost(unitPrice, amount) {
    // Basit hesaplama - gerçek uygulamada daha karmaşık olabilir
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (amount.includes('kg')) {
      return unitPrice * numericAmount;
    } else if (amount.includes('g')) {
      return unitPrice * (numericAmount / 1000);
    } else if (amount.includes('ml')) {
      return unitPrice * (numericAmount / 1000);
    } else if (amount.includes('adet')) {
      return unitPrice * (numericAmount / 10); // 10 adet paket varsayımı
    }
    return unitPrice * 0.1; // Varsayılan
  }

  // Kategori bazında tahmini fiyat
  getEstimatedPrice(categoryId) {
    const estimatedPrices = {
      1: 3.50, // Pieczywo
      2: 2.80, // Warzywa i owoce  
      3: 15.00, // Mięso i ryby
      4: 4.50, // Nabiał
      5: 6.00, // Oleje i tłuszcze
      8: 2.00, // Przyprawy
      9: 8.00, // Artykuły specjalne
      10: 5.00 // Słodycze
    };
    return estimatedPrices[categoryId] || 5.00;
  }

  // Mağazaya göre grupla
  groupByStore(ingredients) {
    const storeGroups = {};
    ingredients.forEach(ingredient => {
      if (ingredient.found) {
        const store = ingredient.cheapest_store;
        if (!storeGroups[store]) {
          storeGroups[store] = {
            store_name: store,
            items: [],
            total_cost: 0
          };
        }
        storeGroups[store].items.push(ingredient);
        storeGroups[store].total_cost += ingredient.estimated_cost;
      }
    });
    return storeGroups;
  }

  // Sepete ekleme önerisi
  generateShoppingList(dishId) {
    const costAnalysis = this.calculateDishCost(dishId);
    if (costAnalysis.error) {
      return costAnalysis;
    }

    const shoppingList = {
      dish_name: costAnalysis.dish_info.name,
      total_estimated_cost: costAnalysis.cost_summary.total_cost,
      items_to_add: [],
      store_recommendations: []
    };

    // Sepete eklenecek ürünler
    costAnalysis.ingredients.forEach(ingredient => {
      if (ingredient.found) {
        shoppingList.items_to_add.push({
          product_name: ingredient.name,
          amount: ingredient.amount,
          store: ingredient.cheapest_store,
          price: ingredient.cheapest_price,
          estimated_cost: ingredient.estimated_cost
        });
      }
    });

    // Mağaza önerileri
    const storeRecommendations = Object.values(costAnalysis.cheapest_stores)
      .sort((a, b) => b.items.length - a.items.length);
    
    shoppingList.store_recommendations = storeRecommendations.slice(0, 3);

    return shoppingList;
  }

  // Popüler yemekler (maliyete göre)
  getPopularDishes() {
    return this.dishes
      .map(dish => {
        const cost = this.calculateDishCost(dish.id);
        return {
          ...dish,
          estimated_cost: cost.cost_summary?.total_cost || 0,
          savings: cost.cost_summary?.savings || 0,
          savings_percentage: cost.cost_summary?.savings_percentage || 0
        };
      })
      .sort((a, b) => b.savings_percentage - a.savings_percentage)
      .slice(0, 5);
  }

  // Yemek malzemelerini ürün kataloğuna ekle
  generateCookingIngredients() {
    const cookingIngredients = [
      // Et ve Et Ürünleri
      {
        id: 1001,
        name: "Kielbasa Krakowska",
        description: "Geleneksel Polonya sosisi 300g",
        brand: "Tarczyński",
        category_id: 3,
        category_name: "Mięso i ryby",
        category_icon: "🥩",
        prices: [
          { store_name: "Biedronka", price: 12.99 },
          { store_name: "LIDL", price: 11.79 },
          { store_name: "Carrefour", price: 13.49 },
          { store_name: "Dino", price: 12.59 }
        ]
      },
      {
        id: 1002,
        name: "Boczek wędzony",
        description: "Tütsülenmiş domuz pastırması 200g",
        brand: "Sokołów", 
        category_id: 3,
        category_name: "Mięso i ryby",
        category_icon: "🥩",
        prices: [
          { store_name: "Biedronka", price: 8.99 },
          { store_name: "LIDL", price: 8.49 },
          { store_name: "Kaufland", price: 9.29 },
          { store_name: "Carrefour", price: 9.49 }
        ]
      },
      {
        id: 1003,
        name: "Schab bez kości",
        description: "Kemik pirzola eti 1kg",
        brand: "Lokalna",
        category_id: 3,
        category_name: "Mięso i ryby", 
        category_icon: "🥩",
        prices: [
          { store_name: "Biedronka", price: 24.99 },
          { store_name: "LIDL", price: 23.79 },
          { store_name: "Carrefour", price: 26.49 },
          { store_name: "Auchan", price: 25.29 }
        ]
      },

      // Sebze ve Yöresel Ürünler
      {
        id: 1004,
        name: "Kapusta kiszona",
        description: "Fermente edilmiş lahana 500g",
        brand: "Krakus",
        category_id: 2,
        category_name: "Warzywa i owoce",
        category_icon: "🥬",
        prices: [
          { store_name: "Biedronka", price: 3.99 },
          { store_name: "LIDL", price: 3.49 },
          { store_name: "Dino", price: 4.19 },
          { store_name: "Żabka", price: 4.49 }
        ]
      },
      {
        id: 1005,
        name: "Grzyby suszone",
        description: "Kurutulmuş mantarlar 50g",
        brand: "Natura",
        category_id: 2,
        category_name: "Warzywa i owoce",
        category_icon: "🍄",
        prices: [
          { store_name: "Carrefour", price: 8.99 },
          { store_name: "LIDL", price: 7.79 },
          { store_name: "Kaufland", price: 9.49 },
          { store_name: "Biedronka", price: 8.29 }
        ]
      },
      {
        id: 1006,
        name: "Kapusta biała",
        description: "Taze beyaz lahana 1kg",
        brand: "Lokalna",
        category_id: 2,
        category_name: "Warzywa i owoce",
        category_icon: "🥬",
        prices: [
          { store_name: "Biedronka", price: 2.99 },
          { store_name: "LIDL", price: 2.79 },
          { store_name: "Dino", price: 3.19 },
          { store_name: "Carrefour", price: 3.29 }
        ]
      },
      {
        id: 1007,
        name: "Czosnek",
        description: "Taze sarımsak 250g",
        brand: "Lokalna",
        category_id: 2,
        category_name: "Warzywa i owoce",
        category_icon: "🧄",
        prices: [
          { store_name: "Biedronka", price: 4.99 },
          { store_name: "LIDL", price: 4.49 },
          { store_name: "Carrefour", price: 5.29 },
          { store_name: "Dino", price: 4.79 }
        ]
      },

      // Süt Ürünleri
      {
        id: 1008,
        name: "Twaróg półtłusty",
        description: "Yarım yağlı cottage cheese 500g",
        brand: "Mlekpol",
        category_id: 4,
        category_name: "Nabiał",
        category_icon: "🧀",
        prices: [
          { store_name: "LIDL", price: 6.99 },
          { store_name: "Biedronka", price: 7.49 },
          { store_name: "Carrefour", price: 7.99 },
          { store_name: "Dino", price: 7.29 }
        ]
      },
      {
        id: 1009,
        name: "Śmietana 18%",
        description: "Krema %18 yağ 200ml",
        brand: "Łaciate",
        category_id: 4,
        category_name: "Nabiał",
        category_icon: "🥛",
        prices: [
          { store_name: "Biedronka", price: 2.99 },
          { store_name: "LIDL", price: 2.79 },
          { store_name: "Carrefour", price: 3.19 },
          { store_name: "Dino", price: 2.89 }
        ]
      },

      // Un ve Tahıllar
      {
        id: 1010,
        name: "Mąka pszenna typ 500",
        description: "Buğday unu tip 500 1kg",
        brand: "Melvit",
        category_id: 1,
        category_name: "Pieczywo",
        category_icon: "🌾",
        prices: [
          { store_name: "Biedronka", price: 2.99 },
          { store_name: "LIDL", price: 2.79 },
          { store_name: "Carrefour", price: 3.19 },
          { store_name: "Dino", price: 2.89 }
        ]
      },
      {
        id: 1011,
        name: "Bułka tarta",
        description: "Galeta unu 500g",
        brand: "Babuni",
        category_id: 1,
        category_name: "Pieczywo",
        category_icon: "🍞",
        prices: [
          { store_name: "Biedronka", price: 3.49 },
          { store_name: "LIDL", price: 3.29 },
          { store_name: "Carrefour", price: 3.79 },
          { store_name: "Kaufland", price: 3.59 }
        ]
      },

      // Yağlar ve Baharatlar
      {
        id: 1012,
        name: "Olej rzepakowy",
        description: "Kolza yağı 1L",
        brand: "Kujawski",
        category_id: 5,
        category_name: "Oleje i tłuszcze",
        category_icon: "🫒",
        prices: [
          { store_name: "Biedronka", price: 7.99 },
          { store_name: "LIDL", price: 7.49 },
          { store_name: "Carrefour", price: 8.29 },
          { store_name: "Dino", price: 7.79 }
        ]
      },
      {
        id: 1013,
        name: "Liść laurowy",
        description: "Defne yaprağı 10g",
        brand: "Kamis",
        category_id: 8,
        category_name: "Przyprawy",
        category_icon: "🌿",
        prices: [
          { store_name: "Biedronka", price: 2.49 },
          { store_name: "LIDL", price: 2.29 },
          { store_name: "Carrefour", price: 2.79 },
          { store_name: "Żabka", price: 2.99 }
        ]
      },
      {
        id: 1014,
        name: "Majeranek",
        description: "Kekik baharat 15g",
        brand: "Kamis",
        category_id: 8,
        category_name: "Przyprawy",
        category_icon: "🌿",
        prices: [
          { store_name: "Biedronka", price: 2.99 },
          { store_name: "LIDL", price: 2.79 },
          { store_name: "Carrefour", price: 3.19 },
          { store_name: "Dino", price: 2.89 }
        ]
      },

      // Özel Malzemeler
      {
        id: 1015,
        name: "Żurek starter",
        description: "Żurek çorba mayası 500ml",
        brand: "Urbanek",
        category_id: 9,
        category_name: "Artykuły specjalne",
        category_icon: "🥣",
        prices: [
          { store_name: "Carrefour", price: 4.99 },
          { store_name: "Kaufland", price: 4.79 },
          { store_name: "Auchan", price: 5.19 },
          { store_name: "LIDL", price: 4.59 }
        ]
      },
      {
        id: 1016,
        name: "Herbatniki maślane",
        description: "Tereyağlı bisküvi 200g",
        brand: "Delicje",
        category_id: 10,
        category_name: "Słodycze",
        category_icon: "🍪",
        prices: [
          { store_name: "Biedronka", price: 4.99 },
          { store_name: "LIDL", price: 4.79 },
          { store_name: "Carrefour", price: 5.29 },
          { store_name: "Dino", price: 5.09 }
        ]
      },
      {
        id: 1017,
        name: "Cukier biały",
        description: "Beyaz şeker 1kg",
        brand: "Diamant",
        category_id: 9,
        category_name: "Artykuły specjalne",
        category_icon: "🍯",
        prices: [
          { store_name: "Biedronka", price: 3.99 },
          { store_name: "LIDL", price: 3.79 },
          { store_name: "Carrefour", price: 4.19 },
          { store_name: "Dino", price: 3.89 }
        ]
      },
      {
        id: 1018,
        name: "Wanilia",
        description: "Vanilya baharat 20g",
        brand: "Dr. Oetker",
        category_id: 8,
        category_name: "Przyprawy", 
        category_icon: "🌿",
        prices: [
          { store_name: "Biedronka", price: 4.99 },
          { store_name: "LIDL", price: 4.79 },
          { store_name: "Carrefour", price: 5.29 },
          { store_name: "Kaufland", price: 5.09 }
        ]
      },
      {
        id: 1019,
        name: "Rodzynki",
        description: "Kuru üzüm 250g",
        brand: "Alesto",
        category_id: 10,
        category_name: "Słodycze",
        category_icon: "🍇",
        prices: [
          { store_name: "LIDL", price: 6.99 },
          { store_name: "Biedronka", price: 7.49 },
          { store_name: "Carrefour", price: 7.99 },
          { store_name: "Kaufland", price: 7.29 }
        ]
      }
    ];

    return cookingIngredients;
  }

  // Malzemeleri ana ürün kataloğuna ekle
  addIngredientsToProductCatalog() {
    const newIngredients = this.generateCookingIngredients();
    this.products = [...this.products, ...newIngredients];
    return this.products;
  }
}

module.exports = PolishDishesService; 