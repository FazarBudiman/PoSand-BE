import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { Inject } from '@nestjs/common';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Sale } from '../domain/sale.entity';
import { ISaleRepository } from '../domain/interface/sale.repository.interface';
import { SaleRow } from './sale.row';

export class SaleRepository implements ISaleRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createSale(
    productSale: Sale,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleRow> {
    const client = pgContext || this.pool;

    const query = `
      INSERT INTO product_sales (
        id, invoice_number, customer_id,
        sub_total, items_discount_total,
        discount_type, discount_value, discount_amount,
        grand_total, total_paid, remaining_amount,
        status, notes, created_by
      ) 
      VALUES (
        $1, $2, $3,
        $4, $5, 
        $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14
      )
      RETURNING *;
    `;

    const { rows } = await client.query<SaleRow>(query, [
      productSale.id,
      productSale.invoiceNumber,
      productSale.customerId,
      productSale.subTotal,
      productSale.itemsDiscountTotal,
      productSale.discountType,
      productSale.discountValue,
      productSale.discountAmount,
      productSale.grandTotal,
      productSale.totalPaid,
      productSale.remainingAmount,
      productSale.status,
      productSale.note,
      createdBy,
    ]);

    return rows[0];
  }

  async getNextIdSale(pgContext?: PgTransactionContext): Promise<string> {
    const client = pgContext || this.pool;

    const query = `
      SELECT nextval('product_sales_id_seq');
    `;

    const result = await client.query<{ nextval: string }>(query);
    return result.rows[0].nextval;
  }

  async findAllSales(pgContext?: PgTransactionContext): Promise<SaleRow[]> {
    const client = pgContext || this.pool;

    const query = `
      SELECT 
        id, invoice_number, customer_id,
        sub_total, items_discount_total,
        discount_type, discount_value, discount_amount,
        grand_total, total_paid, remaining_amount,
        status, notes
      FROM product_sales;
    `;

    const { rows } = await client.query<SaleRow>(query);
    return rows;
  }

  async findSaleById(
    id: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleRow> {
    const client = pgContext || this.pool;

    const query = `
      SELECT 
        id, invoice_number, customer_id,
        sub_total, items_discount_total,
        discount_type, discount_value, discount_amount,
        grand_total, total_paid, remaining_amount,
        status, notes
      FROM product_sales
      WHERE id = $1;
    `;

    const { rows } = await client.query<SaleRow>(query, [id]);
    return rows[0];
  }

  async updateSaleById(
    saleId: string,
    sale: Partial<Sale>,
    updatedBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleRow | undefined> {
    const client = pgContext || this.pool;
    const { rows } = await client.query<SaleRow>(
      `UPDATE product_sales 
      SET 
        total_paid = $1, 
        remaining_amount = $2, 
        status = $3, 
        updated_by = $4 
      WHERE id = $5 RETURNING *;`,
      [sale.totalPaid, sale.remainingAmount, sale.status, updatedBy, saleId],
    );
    if (rows.length === 0) return undefined;
    return rows[0];
  }
}
