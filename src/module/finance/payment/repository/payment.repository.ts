import { Payment } from '../domain/payment.entity';
import { Inject } from '@nestjs/common';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';
import { IPaymentRepository } from '../domain/interface/payment.repository.interface';

export class PaymentRepository implements IPaymentRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}
  async createPayment(
    payment: Payment,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void> {
    const client = pgContext || this.pool;

    await client.query<any>(
      'INSERT INTO payments (method, amount, source_id, source_type, payment_type, reference_number, notes, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        payment.paymentMethod,
        payment.amount,
        payment.sourceId,
        payment.sourceType,
        payment.paymentType,
        payment.referenceNumber,
        payment.notes,
        createdBy,
      ],
    );
  }
}
