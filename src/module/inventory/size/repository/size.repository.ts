import { Inject, Injectable } from '@nestjs/common';
import { ISizeRepository } from '../domain/interface/size.repository.interface';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool, PoolClient } from 'pg';
import { TransactionContext } from 'src/shared/database/transaction/transaction-manager.interface';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { SizeRow } from './size.row';

@Injectable()
export class SizeRepository implements ISizeRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createSizes(
    sizeGroupId: string,
    sizes: string[],
    createdBy: string,
    context?: PgTransactionContext,
  ): Promise<SizeRow[]> {
    if (!sizes || sizes.length === 0) return [];

    const client = context || this.pool;

    const { rows } = await client.query<SizeRow>(
      `
      INSERT INTO sizes (size_group_id, size_name, created_by)
      SELECT $1, unnest($2::text[]), $3
      RETURNING *
    `,
      [sizeGroupId, sizes, createdBy],
    );

    return rows;
  }

  async deleteSizesBySizeGroupId(
    id: string,
    softDelete: boolean = false,
    context?: TransactionContext,
  ): Promise<boolean> {
    const client = context ? (context as unknown as PoolClient) : this.pool;
    const query = softDelete
      ? `
        UPDATE sizes
          SET is_deleted = true
          WHERE size_group_id = $1
        `
      : `
        DELETE FROM sizes
          WHERE size_group_id = $1`;
    const { rowCount } = await client.query<SizeRow>(query, [id]);
    return rowCount !== null && rowCount > 0;
  }
}
