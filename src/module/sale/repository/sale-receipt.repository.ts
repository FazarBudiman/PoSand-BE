import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { ISaleReceiptRepository } from '../domain/interface/sale-receipt.repository.interface';
import { SaleReceiptResponseDto } from '../dto/response/sale-receipt.response.dto';

@Injectable()
export class SaleReceiptRepository implements ISaleReceiptRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findSaleReceiptById(
    id: string,
    pgContext?: PgTransactionContext,
  ): Promise<SaleReceiptResponseDto> {
    const client = pgContext || this.pool;
    const query = `
      SELECT 
        ps.id,
        ps.invoice_number AS "invoiceNumber",
        ps.sub_total AS "subTotal",
        ps.items_discount_total AS "itemsDiscountTotal",
        ps.discount_type AS "discountType",
        ps.discount_value AS "discountValue",
        ps.discount_amount AS "discountAmount",
        ps.grand_total AS "grandTotal",
        ps.total_paid AS "totalPaid",
        ps.remaining_amount AS "remainingAmount",
        ps.status,
        ps.created_at AS "createdAt",
        json_build_object(
            'id', c.id,
            'name', c.fullname,
            'phone', c.phone
        ) AS customer,
        (
            SELECT json_agg(json_build_object(
                'productName', p.name,
                'size', s.size_name,
                'quantity', psi.quantity,
                'unitPrice', psi.unit_price,
                'discountType', psi.discount_type,
                'discountValue', psi.discount_value,
                'discountAmount', psi.discount_amount,
                'subTotal', psi.sub_total
            ))
            FROM product_sale_items psi
            JOIN products p ON psi.product_id = p.id
            LEFT JOIN product_variants pv ON psi.product_variant_id = pv.id
            LEFT JOIN sizes s ON pv.size_id = s.id
            WHERE psi.product_sale_id = ps.id
        ) AS items,
        (
            SELECT COALESCE(json_agg(json_build_object(
                'id', pay.id,
                'paymentType', pay.payment_type,
                'method', pay.method,
                'amount', pay.amount,
                'paidAt', pay.paid_at
            )), '[]'::json)
            FROM payments pay
            WHERE pay.source_id = ps.id AND pay.source_type = 'SALE'
        ) AS payments
      FROM product_sales ps
      JOIN customers c ON ps.customer_id = c.id
      WHERE ps.id = $1;
    `;

    const { rows } = await client.query<SaleReceiptResponseDto>(query, [id]);
    return rows[0];
  }

  async createReceiptSnapshot(
    saleId: string,
    receipt: SaleReceiptResponseDto,
    updatedBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void> {
    const client = pgContext || this.pool;
    await client.query<any>(
      `UPDATE product_sales 
      SET 
        pricing_snapshot = $1, 
        updated_by = $2, updated_at = NOW() 
      WHERE id = $3
      `,
      [receipt, updatedBy, saleId],
    );
  }
}
