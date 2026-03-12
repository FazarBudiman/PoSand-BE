import { Inject, Injectable } from '@nestjs/common';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';
import { IProductVariantRepository } from '../domain/interface/product-variant.repository.interface';
import { ProductVariantRow } from './product-variant.row';
import { ProductVariant } from '../domain/product-variant.entity';

@Injectable()
export class ProductVariantRepository implements IProductVariantRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createProductVariants(
    productId: string,
    productVariant: ProductVariant[],
    createdBy: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariantRow[]> {
    const client = txContext || this.pool;

    const values: string[] = [];
    const params: any[] = [];
    let i = 1;
    for (const item of productVariant) {
      values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
      params.push(productId, item.sizeId, item.quantityStock, createdBy);
    }
    const { rows } = await client.query<ProductVariantRow>(
      `
      INSERT INTO product_variants (product_id, size_id, quantity_stock, created_by)
      VALUES ${values.join(', ')}
      RETURNING id AS variant_id, product_id, size_id, quantity_stock;
    `,
      params,
    );
    return rows;
  }

  async hasActiveStock(productId: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `
      SELECT EXISTS(
        SELECT 1
        FROM product_variants
        WHERE product_id = $1 AND quantity_stock > 0
      );
      `,
      [productId],
    );
    return rows[0].exists;
  }

  async findProductVariantById(
    id: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariantRow | undefined> {
    const client = txContext || this.pool;
    const { rows } = await client.query<ProductVariantRow>(
      `
      SELECT pv.id AS variant_id, pv.product_id, pv.size_id, pv.quantity_stock, p.selling_price
      FROM product_variants pv JOIN products p ON pv.product_id = p.id
      WHERE pv.id = $1;
    `,
      [id],
    );
    if (rows.length === 0) {
      return undefined;
    }
    return rows[0];
  }

  async reduceStocks(
    items: { productVariantId: number; quantity: number }[],
    tx?: PgTransactionContext,
  ): Promise<void> {
    const client = tx || this.pool;

    if (items.length === 0) return;

    const values: any[] = [];
    const placeholders: string[] = [];

    items.forEach((item, index) => {
      const base = index * 2;

      placeholders.push(`($${base + 1}, $${base + 2})`);

      values.push(item.productVariantId, item.quantity);
    });

    const query = `
    UPDATE product_variants pv
    SET quantity_stock = pv.quantity_stock - data.qty::BIGINT,
        updated_at = NOW()
    FROM (
      VALUES ${placeholders.join(',')}
    ) AS data(id, qty)
    WHERE pv.id = data.id::BIGINT
  `;

    await client.query(query, values);
  }
}
