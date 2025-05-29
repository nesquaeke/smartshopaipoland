import { Request, Response } from 'express';
import storeService from '@services/storeService';
import { ApiResponse } from '@models/interfaces';

export class StoreController {
  // GET /api/stores - Get all stores
  async getAllStores(req: Request, res: Response) {
    try {
      const stores = await storeService.getAllStores();
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Sklepy pobrane pomyślnie',
        data: stores,
        meta: {
          total: stores.length
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAllStores:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania sklepów',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/stores/:id - Get single store
  async getStoreById(req: Request, res: Response) {
    try {
      const storeId = parseInt(req.params.id);
      
      if (isNaN(storeId)) {
        return res.status(400).json({
          success: false,
          error: 'Nieprawidłowy ID sklepu'
        });
      }

      const store = await storeService.getStoreById(storeId);
      
      if (!store) {
        return res.status(404).json({
          success: false,
          error: 'Sklep nie został znaleziony'
        });
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Sklep pobrany pomyślnie',
        data: store
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getStoreById:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania sklepu',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/stores/:id/locations - Get store locations
  async getStoreLocations(req: Request, res: Response) {
    try {
      const storeId = parseInt(req.params.id);
      const userLat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const userLon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
      
      if (isNaN(storeId)) {
        return res.status(400).json({
          success: false,
          error: 'Nieprawidłowy ID sklepu'
        });
      }

      const locations = await storeService.getStoreLocations(storeId, userLat, userLon);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Lokalizacje sklepu pobrane pomyślnie',
        data: locations,
        meta: {
          total: locations.length,
          sortedByDistance: !!(userLat && userLon)
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getStoreLocations:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania lokalizacji sklepu',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/stores/type/:type - Get stores by type
  async getStoresByType(req: Request, res: Response) {
    try {
      const storeType = req.params.type;
      
      if (!['discount', 'convenience', 'hypermarket', 'supermarket'].includes(storeType)) {
        return res.status(400).json({
          success: false,
          error: 'Nieprawidłowy typ sklepu'
        });
      }

      const stores = await storeService.getStoresByType(storeType);
      
      const response: ApiResponse<any> = {
        success: true,
        message: `Sklepy typu ${storeType} pobrane pomyślnie`,
        data: stores,
        meta: {
          total: stores.length,
          type: storeType
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getStoresByType:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania sklepów według typu',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/stores/nearby - Get stores near location
  async getStoresNearLocation(req: Request, res: Response) {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const radius = req.query.radius ? parseFloat(req.query.radius as string) : 10;

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({
          success: false,
          error: 'Wymagane są współrzędne geograficzne (lat, lon)'
        });
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return res.status(400).json({
          success: false,
          error: 'Nieprawidłowe współrzędne geograficzne'
        });
      }

      const stores = await storeService.getStoresNearLocation(lat, lon, radius);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Sklepy w pobliżu pobrane pomyślnie',
        data: stores,
        meta: {
          total: stores.length,
          searchRadius: radius,
          userLocation: { lat, lon }
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getStoresNearLocation:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania sklepów w pobliżu',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/stores/stats - Get store statistics
  async getStoreStats(req: Request, res: Response) {
    try {
      const stats = await storeService.getStoreStats();
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Statystyki sklepów pobrane pomyślnie',
        data: stats
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getStoreStats:', error);
      res.status(500).json({
        success: false,
        error: 'Błąd podczas pobierania statystyk sklepów',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new StoreController(); 