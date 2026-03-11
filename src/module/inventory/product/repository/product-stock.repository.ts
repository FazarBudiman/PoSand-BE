import { Inject } from '@nestjs/common';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { IProductStockRepository } from '../domain/interface/product-stock.repository.interface';
import { ProductStockRow } from './product-stock.row';

export class ProductStockRepository implements IProductStockRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findStockHistoryByProductId(id: string): Promise<ProductStockRow[]> {
    const { rows } = await this.pool.query<ProductStockRow>(
      `
      SELECT 
        p.id as product_id,
        p.name as product_name,
        pv.id as variant_id, 
        s.size_name, 
        pv.quantity_stock,
        COALESCE(
            json_agg(
            json_build_object(
                'id', sm.id,
                'quantity', sm.quantity,
                'type', sm.type,
                'reference_type', sm.reference_type,
                'created_at', sm.created_at
            ) ORDER BY sm.created_at DESC
            ) FILTER (WHERE sm.id IS NOT NULL), 
            '[]'
        ) as "stock_history"
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN sizes s ON s.id = pv.size_id
        LEFT JOIN stock_movements sm ON pv.id = sm.product_variant_id
        WHERE p.id = $1
        GROUP BY p.id, p.name, pv.id, s.size_name, pv.quantity_stock; 
      `,
      [id],
    );

    return rows;
  }
}
