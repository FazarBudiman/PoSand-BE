import { Inject, Injectable } from '@nestjs/common';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { MovementType } from 'src/shared/types/movement-type.enum';
import { IStockMovementRepository } from '../domain/interface/stock-movement.repository.interface';
import { ProductVariantRow } from './product-variant.row';

@Injectable()
export class StockMovementRepository implements IStockMovementRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async insertStockMovements(
    variants: ProductVariantRow[],
    referenceType: string,
    referenceId: string,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<void> {
    const client = txContext || this.pool;

    const values: string[] = [];
    const params: any[] = [];
    let i = 1;

    for (const variant of variants) {
      values.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
      params.push(
        variant.variant_id,
        variant.quantity_stock,
        MovementType.IN,
        referenceType,
        referenceId,
        userWhoCreated,
      );
    }

    await client.query(
      `
      INSERT INTO stock_movements (product_variant_id, quantity, type, reference_type, reference_id, created_by)
      VALUES ${values.join(', ')}
      `,
      params,
    );
  }

  async insertOutStockMovements(
    items: { productVariantId: number; quantity: number }[],
    referenceId: string,
    createdBy: string,
    tx?: PgTransactionContext,
  ): Promise<void> {
    const client = tx || this.pool;

    if (items.length === 0) return;

    const values: any[] = [];
    const placeholders: string[] = [];

    items.forEach((item, index) => {
      const base = index * 6;

      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`,
      );

      values.push(
        item.productVariantId,
        item.quantity,
        'OUT',
        'PRODUCT_SALE',
        referenceId,
        createdBy,
      );
    });

    const query = `
    INSERT INTO stock_movements (
      product_variant_id,
      quantity,
      type,
      reference_type,
      reference_id,
      created_by
    )
    VALUES ${placeholders.join(',')}
  `;

    await client.query(query, values);
  }
}
