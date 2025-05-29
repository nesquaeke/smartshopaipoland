import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/stores - Get all stores
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Sklepy pobrane pomyślnie',
    data: [
      {
        id: 1,
        name: 'Biedronka',
        type: 'discount',
        website: 'https://www.biedronka.pl',
        categories: ['fruits', 'bread', 'dairy'],
        location_count: 3000
      },
      {
        id: 2,
        name: 'Żabka',
        type: 'convenience',
        website: 'https://www.zabka.pl',
        categories: ['snacks', 'drinks', 'essentials'],
        location_count: 8000
      },
      {
        id: 3,
        name: 'LIDL',
        type: 'discount',
        website: 'https://www.lidl.pl',
        categories: ['organic', 'bread', 'meat', 'dairy'],
        location_count: 800
      },
      {
        id: 4,
        name: 'Auchan',
        type: 'hypermarket',
        website: 'https://www.auchan.pl',
        categories: ['electronics', 'clothing', 'home', 'food'],
        location_count: 90
      },
      {
        id: 5,
        name: 'Carrefour',
        type: 'hypermarket',
        website: 'https://www.carrefour.pl',
        categories: ['food', 'electronics', 'clothing'],
        location_count: 90
      },
      {
        id: 6,
        name: 'Netto',
        type: 'discount',
        website: 'https://www.netto.pl',
        categories: ['fruits', 'vegetables'],
        location_count: 400
      }
    ],
    meta: {
      total: 6
    }
  });
});

// GET /api/stores/:id - Get single store
router.get('/:id', (req: Request, res: Response) => {
  const storeId = parseInt(req.params.id);
  
  if (isNaN(storeId)) {
    return res.status(400).json({
      success: false,
      error: 'Nieprawidłowy ID sklepu'
    });
  }

  // Sample store data
  const stores: any = {
    1: { id: 1, name: 'Biedronka', type: 'discount', website: 'https://www.biedronka.pl', categories: ['fruits', 'bread', 'dairy'], location_count: 3000 },
    2: { id: 2, name: 'Żabka', type: 'convenience', website: 'https://www.zabka.pl', categories: ['snacks', 'drinks', 'essentials'], location_count: 8000 },
    3: { id: 3, name: 'LIDL', type: 'discount', website: 'https://www.lidl.pl', categories: ['organic', 'bread', 'meat', 'dairy'], location_count: 800 },
    4: { id: 4, name: 'Auchan', type: 'hypermarket', website: 'https://www.auchan.pl', categories: ['electronics', 'clothing', 'home', 'food'], location_count: 90 },
    5: { id: 5, name: 'Carrefour', type: 'hypermarket', website: 'https://www.carrefour.pl', categories: ['food', 'electronics', 'clothing'], location_count: 90 },
    6: { id: 6, name: 'Netto', type: 'discount', website: 'https://www.netto.pl', categories: ['fruits', 'vegetables'], location_count: 400 }
  };

  const store = stores[storeId];
  
  if (!store) {
    return res.status(404).json({
      success: false,
      error: 'Sklep nie został znaleziony'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Sklep pobrany pomyślnie',
    data: store
  });
});

// GET /api/stores/:id/locations - Get store locations
router.get('/:id/locations', (req: Request, res: Response) => {
  const storeId = parseInt(req.params.id);
  
  if (isNaN(storeId)) {
    return res.status(400).json({
      success: false,
      error: 'Nieprawidłowy ID sklepu'
    });
  }

  // Sample location data
  const sampleLocations = [
    {
      id: 1,
      store_id: storeId,
      name: 'Warszawa Centrum',
      address: 'ul. Marszałkowska 123',
      city: 'Warszawa',
      postal_code: '00-001',
      latitude: 52.2297,
      longitude: 21.0122,
      phone: '+48 22 123 456 789',
      opening_hours: {
        monday: '06:00-23:00',
        tuesday: '06:00-23:00',
        wednesday: '06:00-23:00',
        thursday: '06:00-23:00',
        friday: '06:00-23:00',
        saturday: '07:00-22:00',
        sunday: '08:00-21:00'
      }
    },
    {
      id: 2,
      store_id: storeId,
      name: 'Kraków Stare Miasto',
      address: 'ul. Floriańska 45',
      city: 'Kraków',
      postal_code: '31-021',
      latitude: 50.0647,
      longitude: 19.9450,
      phone: '+48 12 345 678 901',
      opening_hours: {
        monday: '06:00-23:00',
        tuesday: '06:00-23:00',
        wednesday: '06:00-23:00',
        thursday: '06:00-23:00',
        friday: '06:00-23:00',
        saturday: '07:00-22:00',
        sunday: '08:00-21:00'
      }
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Lokalizacje sklepu pobrane pomyślnie',
    data: sampleLocations,
    meta: {
      total: sampleLocations.length
    }
  });
});

export default router; 