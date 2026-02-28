import { Injectable, Inject } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import {
  ITransactionManager,
  TransactionContext,
} from './transaction-manager.interface';
import { PG_POOL } from '../tokens/pg.token';

export type PgTransactionContext = PoolClient & TransactionContext;

@Injectable()
export class PgTransactionManager implements ITransactionManager {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  async runInTransaction<T>(
    work: (context: TransactionContext) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const context = client as PgTransactionContext;

      const result = await work(context);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
