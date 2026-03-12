import { Inject } from '@nestjs/common';
import { Cashflow } from '../domain/cashflow.entity';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { ICashflowRepository } from '../domain/interface/cashflow.repository.interface';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';

export class CashflowRepository implements ICashflowRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}
  async createCashflow(
    cashflow: Cashflow,
    createdBy: string,
    pgContext?: PgTransactionContext,
  ): Promise<void> {
    const client = pgContext || this.pool;

    await client.query<any>(
      'INSERT INTO cashflows (type, source_type, source_id, amount, description, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        cashflow.type,
        cashflow.sourceType,
        cashflow.sourceId,
        cashflow.amount,
        cashflow.description,
        createdBy,
      ],
    );
  }
}
