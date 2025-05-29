import pool from '@config/database';
import { Store, StoreLocation } from '@models/interfaces';

export class StoreService {
  // Get all stores
  async getAllStores(): Promise<Store[]> {
    try {
      const query = `
        SELECT id, name, type, website, logo_url, categories, location_count, created_at, updated_at
        FROM stores 
        ORDER BY name
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw new Error('Failed to fetch stores');
    }
  }

  // Get store by ID
  async getStoreById(id: number): Promise<Store | null> {
    try {
      const query = `
        SELECT id, name, type, website, logo_url, categories, location_count, created_at, updated_at
        FROM stores 
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching store by ID:', error);
      throw new Error('Failed to fetch store');
    }
  }

  // Get store locations
  async getStoreLocations(storeId: number, userLat?: number, userLon?: number): Promise<StoreLocation[]> {
    try {
      let query = `
        SELECT id, store_id, name, address, city, postal_code, latitude, longitude, phone, opening_hours, created_at, updated_at
      `;
      
      // Add distance calculation if user coordinates provided
      if (userLat && userLon) {
        query += `, calculate_distance($2, $3, latitude, longitude) as distance`;
      }
      
      query += `
        FROM store_locations 
        WHERE store_id = $1
      `;
      
      if (userLat && userLon) {
        query += ` ORDER BY distance ASC`;
      } else {
        query += ` ORDER BY city, name`;
      }

      const params = userLat && userLon ? [storeId, userLat, userLon] : [storeId];
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching store locations:', error);
      throw new Error('Failed to fetch store locations');
    }
  }

  // Get stores by type
  async getStoresByType(type: string): Promise<Store[]> {
    try {
      const query = `
        SELECT id, name, type, website, logo_url, categories, location_count, created_at, updated_at
        FROM stores 
        WHERE type = $1
        ORDER BY name
      `;
      const result = await pool.query(query, [type]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching stores by type:', error);
      throw new Error('Failed to fetch stores by type');
    }
  }

  // Search stores near location
  async getStoresNearLocation(lat: number, lon: number, radiusKm: number = 10): Promise<any[]> {
    try {
      const query = `
        SELECT DISTINCT s.id, s.name, s.type, s.website, s.logo_url, s.categories, s.location_count,
               sl.id as location_id, sl.name as location_name, sl.address, sl.city, sl.latitude, sl.longitude,
               calculate_distance($1, $2, sl.latitude, sl.longitude) as distance
        FROM stores s
        JOIN store_locations sl ON s.id = sl.store_id
        WHERE calculate_distance($1, $2, sl.latitude, sl.longitude) <= $3
        ORDER BY distance ASC
      `;
      const result = await pool.query(query, [lat, lon, radiusKm]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching stores near location:', error);
      throw new Error('Failed to fetch stores near location');
    }
  }

  // Get store statistics
  async getStoreStats(): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_stores,
          COUNT(CASE WHEN type = 'discount' THEN 1 END) as discount_stores,
          COUNT(CASE WHEN type = 'convenience' THEN 1 END) as convenience_stores,
          COUNT(CASE WHEN type = 'hypermarket' THEN 1 END) as hypermarket_stores,
          COUNT(CASE WHEN type = 'supermarket' THEN 1 END) as supermarket_stores,
          SUM(location_count) as total_locations
        FROM stores
      `;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching store stats:', error);
      throw new Error('Failed to fetch store statistics');
    }
  }
}

export default new StoreService(); 