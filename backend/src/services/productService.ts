import pool from '@config/database';
import { Product, ProductCategory, PriceComparison, ProductPrice, PaginationOptions } from '@models/interfaces';

export class ProductService {
  // Get all products with pagination and filters
  async getAllProducts(options: PaginationOptions & { categoryId?: number, search?: string }): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    try {
      const { page = 1, limit = 20, categoryId, search, sortBy = 'name', sortOrder = 'asc' } = options;
      const offset = (page - 1) * limit;

      let baseQuery = `
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
      `;
      
      let whereConditions = [];
      let queryParams: any[] = [];
      let paramIndex = 1;

      if (categoryId) {
        whereConditions.push(`p.category_id = $${paramIndex}`);
        queryParams.push(categoryId);
        paramIndex++;
      }

      if (search) {
        whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `SELECT COUNT(*) as total ${baseQuery} ${whereClause}`;
      const countResult = await pool.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Data query
      const dataQuery = `
        SELECT p.id, p.name, p.description, p.brand, p.category_id, p.barcode, 
               p.unit_type, p.unit_size, p.image_url, p.created_at, p.updated_at,
               pc.name_pl as category_name, pc.icon as category_icon
        ${baseQuery}
        ${whereClause}
        ORDER BY p.${sortBy} ${sortOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(limit, offset);
      const dataResult = await pool.query(dataQuery, queryParams);

      return {
        products: dataResult.rows,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const query = `
        SELECT p.id, p.name, p.description, p.brand, p.category_id, p.barcode, 
               p.unit_type, p.unit_size, p.image_url, p.created_at, p.updated_at,
               pc.name_pl as category_name, pc.icon as category_icon
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // Get product categories
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const query = `
        SELECT id, name, name_pl, icon, parent_id, created_at, updated_at
        FROM product_categories
        ORDER BY name_pl
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId: number, options: PaginationOptions): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    return this.getAllProducts({ ...options, categoryId });
  }

  // Search products
  async searchProducts(searchTerm: string, options: PaginationOptions): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    return this.getAllProducts({ ...options, search: searchTerm });
  }

  // Get product price comparison across stores
  async getProductPriceComparison(productId: number, userLat?: number, userLon?: number): Promise<PriceComparison | null> {
    try {
      // First get product details
      const product = await this.getProductById(productId);
      if (!product) return null;

      // Get prices from all stores
      let priceQuery = `
        SELECT pr.price, pr.discount_price, pr.discount_percentage, pr.is_promotion, pr.in_stock,
               s.id as store_id, s.name as store_name, s.logo_url as store_logo,
               sl.id as location_id, sl.latitude, sl.longitude
      `;

      if (userLat && userLon) {
        priceQuery += `, calculate_distance($2, $3, sl.latitude, sl.longitude) as distance`;
      }

      priceQuery += `
        FROM prices pr
        JOIN stores s ON pr.store_id = s.id
        LEFT JOIN store_locations sl ON pr.store_location_id = sl.id
        WHERE pr.product_id = $1 AND pr.in_stock = true
      `;

      if (userLat && userLon) {
        priceQuery += ` ORDER BY distance ASC, pr.price ASC`;
      } else {
        priceQuery += ` ORDER BY pr.price ASC`;
      }

      const params = userLat && userLon ? [productId, userLat, userLon] : [productId];
      const priceResult = await pool.query(priceQuery, params);

      if (priceResult.rows.length === 0) {
        return null;
      }

      const prices: ProductPrice[] = priceResult.rows.map(row => ({
        store_id: row.store_id,
        store_name: row.store_name,
        store_logo: row.store_logo,
        price: parseFloat(row.price),
        discount_price: row.discount_price ? parseFloat(row.discount_price) : undefined,
        discount_percentage: row.discount_percentage ? parseFloat(row.discount_percentage) : undefined,
        is_promotion: row.is_promotion,
        in_stock: row.in_stock,
        distance: row.distance ? parseFloat(row.distance) : undefined,
        location_id: row.location_id
      }));

      const allPrices = prices.map(p => p.discount_price || p.price);
      const cheapestPrice = Math.min(...allPrices);
      const mostExpensivePrice = Math.max(...allPrices);
      const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
      const bestDealStore = prices.find(p => (p.discount_price || p.price) === cheapestPrice)?.store_name || '';

      return {
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        category: product.category_name,
        prices,
        cheapest_price: cheapestPrice,
        most_expensive_price: mostExpensivePrice,
        average_price: Math.round(averagePrice * 100) / 100,
        price_difference: mostExpensivePrice - cheapestPrice,
        best_deal_store: bestDealStore
      };
    } catch (error) {
      console.error('Error fetching product price comparison:', error);
      throw new Error('Failed to fetch product price comparison');
    }
  }

  // Get trending/popular products
  async getTrendingProducts(limit: number = 10): Promise<Product[]> {
    try {
      // For demo, we'll just return products that are most searched or have most price entries
      const query = `
        SELECT p.id, p.name, p.description, p.brand, p.category_id, p.barcode, 
               p.unit_type, p.unit_size, p.image_url, p.created_at, p.updated_at,
               pc.name_pl as category_name, pc.icon as category_icon,
               COUNT(pr.id) as price_count
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        LEFT JOIN prices pr ON p.id = pr.product_id AND pr.in_stock = true
        GROUP BY p.id, pc.name_pl, pc.icon
        ORDER BY price_count DESC, p.created_at DESC
        LIMIT $1
      `;
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching trending products:', error);
      throw new Error('Failed to fetch trending products');
    }
  }

  // Get products on sale
  async getProductsOnSale(limit: number = 20): Promise<Product[]> {
    try {
      const query = `
        SELECT DISTINCT p.id, p.name, p.description, p.brand, p.category_id, p.barcode, 
               p.unit_type, p.unit_size, p.image_url, p.created_at, p.updated_at,
               pc.name_pl as category_name, pc.icon as category_icon,
               MIN(pr.discount_percentage) as max_discount
        FROM products p
        JOIN product_categories pc ON p.category_id = pc.id
        JOIN prices pr ON p.id = pr.product_id
        WHERE pr.is_promotion = true AND pr.in_stock = true
          AND (pr.promotion_end IS NULL OR pr.promotion_end > NOW())
        GROUP BY p.id, pc.name_pl, pc.icon
        ORDER BY max_discount DESC
        LIMIT $1
      `;
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching products on sale:', error);
      throw new Error('Failed to fetch products on sale');
    }
  }
}

export default new ProductService(); 