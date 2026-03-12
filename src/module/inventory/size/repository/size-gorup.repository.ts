import { Inject, Injectable } from '@nestjs/common';
import { ISizeGroupRepository } from '../domain/interface/size-group.repository.interface';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { SizeGroupRow } from './size-group.row';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';

@Injectable()
export class SizeGroupRepository implements ISizeGroupRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}
  async findAllSizeGroups(): Promise<SizeGroupRow[]> {
    const { rows } = await this.pool.query<SizeGroupRow>(`
      SELECT 
        sg.id,
        sg.group_name,
        json_agg(
          json_build_object(
            'id', s.id,
            'size_name', s.size_name
          )
        ) as sizes
      FROM size_groups sg
      LEFT JOIN sizes s ON sg.id = s.size_group_id
      WHERE sg.is_deleted = false AND s.is_deleted = false
      GROUP BY sg.id, sg.group_name;
    `);

    return rows;
  }

  async createSizeGroup(
    groupName: string,
    userId: string,
    context?: PgTransactionContext,
  ): Promise<SizeGroupRow> {
    const client = context || this.pool;
    const { rows } = await client.query<SizeGroupRow>(
      `
        INSERT INTO size_groups (group_name, created_by)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [groupName, userId],
    );

    return rows[0];
  }

  async findSizeGroupById(id: string): Promise<SizeGroupRow | undefined> {
    const { rows } = await this.pool.query<SizeGroupRow>(
      `
        SELECT 
          sg.id,
          sg.group_name,
          json_agg(
            json_build_object(
              'id', s.id,
              'size_name', s.size_name
            )
          ) as sizes
        FROM size_groups sg
        LEFT JOIN sizes s ON sg.id = s.size_group_id
        WHERE sg.id = $1 AND sg.is_deleted = false AND s.is_deleted = false
        GROUP BY sg.id, sg.group_name;
      `,
      [id],
    );
    if (rows.length === 0) return undefined;

    return rows[0];
  }

  async existsSizeGroupByName(groupName: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `
      SELECT EXISTS(
        SELECT 1
        FROM size_groups
        WHERE group_name = $1
      )  
      `,
      [groupName],
    );
    return rows[0].exists;
  }

  async findSizeGroupByName(
    groupName: string,
  ): Promise<SizeGroupRow | undefined> {
    const { rows } = await this.pool.query<SizeGroupRow>(
      `
        SELECT 
          sg.id,
          sg.group_name,
          json_agg(
            json_build_object(
              'id', s.id,
              'size_name', s.size_name
            )
          ) as sizes
        FROM size_groups sg
        LEFT JOIN sizes s ON sg.id = s.size_group_id
        WHERE sg.group_name = $1 AND sg.is_deleted = false AND s.is_deleted = false
        GROUP BY sg.id, sg.group_name;
      `,
      [groupName],
    );
    if (rows.length === 0) return undefined;

    return rows[0];
  }

  async updateSizeGroupById(
    id: string,
    groupName: string,
    userId: string,
  ): Promise<SizeGroupRow | undefined> {
    const { rows } = await this.pool.query<SizeGroupRow>(
      `UPDATE size_groups
        SET group_name = $2, 
            updated_at = NOW(), updated_by = $3
        WHERE id = $1 AND is_deleted = false
        RETURNING *`,
      [id, groupName, userId],
    );
    if (rows.length === 0) return undefined;

    return rows[0];
  }

  async deleteSizeGroupById(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `
      UPDATE size_groups
      SET is_deleted = true
      WHERE id = $1;
    `,
      [id],
    );
    return rowCount !== null && rowCount > 0;
  }
}
