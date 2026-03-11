import { Inject, Injectable } from '@nestjs/common';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { ISaleItemRepository } from '../domain/interface/sale-item.repository.interface';
import { SaleItem } from '../domain/sale-item.entity';

@Injectable()
export class SaleItemRepository implements ISaleItemRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createSaleItems(
    items: SaleItem[],
    pgContext?: PgTransactionContext,
  ): Promise<any[]> {
    const client = pgContext || this.pool;

    if (items.length === 0) return [];

    const values: any[] = [];
    const placeholders: string[] = [];

    items.forEach((item, index) => {
      const base = index * 9;

      placeholders.push(`
      ($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4},
       $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9})
    `);

      values.push(
        item.saleId,
        item.id,
        item.productVariantId,
        item.quantity,
        item.unitPrice,
        item.discountType,
        item.discountValue,
        item.discountAmount,
        item.subTotal,
      );
    });

    const query = `
    INSERT INTO product_sale_items (
      product_sale_id,
      product_id,
      product_variant_id,
      quantity,
      unit_price,
      discount_type,
      discount_value,
      discount_amount,
      sub_total
    )
    VALUES ${placeholders.join(',')}
    RETURNING *;
  `;

    const { rows } = await client.query(query, values);

    return rows;
  }
}
