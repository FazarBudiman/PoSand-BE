import { Inject } from '@nestjs/common';
import { ISizeRepository } from '../domain/interface/size.repository.interface';
import { SizeGroup } from '../domain/size-group.entity';
import { Size } from '../domain/size.entity';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool, PoolClient } from 'pg';
import { TransactionContext } from 'src/shared/database/transaction/transaction-manager.interface';

interface SizeRows {
  id: string;
  size_name: string;
}

interface SizeGroupRows {
  id: string;
  group_name: string;
  sizes: SizeRows[];
}

function MapSizeGroupRowsToEntity(rows: SizeGroupRows[]): SizeGroup[] {
  return rows.map((row) => ({
    id: row.id,
    groupName: row.group_name,
    sizes: row.sizes.map((size) => ({
      id: size.id,
      sizeName: size.size_name,
    })),
  }));
}

export class SizeRepository implements ISizeRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async getAllSizeGroup(): Promise<SizeGroup[]> {
    const { rows } = await this.pool.query<SizeGroupRows>(`
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

    return MapSizeGroupRowsToEntity(rows);
  }

  async isSizeGroupExist(groupName: string): Promise<boolean> {
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

  async createSizeGroup(
    groupName: string,
    userId: string,
    context?: TransactionContext,
  ): Promise<SizeGroup> {
    const client = context ? (context as unknown as PoolClient) : this.pool;
    const { rows } = await client.query<SizeGroupRows>(
      `
      INSERT INTO size_groups (group_name, created_by)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [groupName, userId],
    );

    const row = rows[0];
    return {
      id: row.id,
      groupName: row.group_name,
      sizes: [],
    };
  }

  async createSizes(
    sizeGroupId: string,
    sizes: string[],
    userId: string,
    context?: TransactionContext,
  ): Promise<Size[]> {
    if (!sizes || sizes.length === 0) return [];

    const client = context ? (context as unknown as PoolClient) : this.pool;

    // Use unnest for bulk insert
    const { rows } = await client.query<SizeRows>(
      `
      INSERT INTO sizes (size_group_id, size_name, created_by)
      SELECT $1, unnest($2::text[]), $3
      RETURNING *
    `,
      [sizeGroupId, sizes, userId],
    );

    return rows.map((row) => ({
      id: row.id,
      sizeName: row.size_name,
    }));
  }

  async getSizeGroupById(id: string): Promise<SizeGroup | undefined> {
    const { rows } = await this.pool.query<SizeGroupRows>(
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

    return MapSizeGroupRowsToEntity(rows)[0];
  }

  async updateSizeGroupById(
    id: string,
    groupName: string,
    userId: string,
  ): Promise<SizeGroup | undefined> {
    const { rows } = await this.pool.query<SizeGroupRows>(
      `
      UPDATE size_groups
      SET group_name = $2, updated_at = NOW(), updated_by = $3
      WHERE id = $1
      RETURNING *;
    `,
      [id, groupName, userId],
    );
    if (rows.length === 0) return undefined;

    return {
      id: rows[0].id,
      groupName: rows[0].group_name,
      sizes: [],
    };
  }

  async deleteSizesBySizeGroupId(
    id: string,
    softDelete: boolean = false,
  ): Promise<boolean> {
    const query = softDelete
      ? `
        UPDATE sizes
          SET is_deleted = true
          WHERE size_group_id = $1
        `
      : `
        DELETE FROM sizes
          WHERE size_group_id = $1`;
    const { rowCount } = await this.pool.query<SizeRows>(query, [id]);
    return rowCount !== null && rowCount > 0;
  }

  async deleteSizeGroupById(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query<SizeGroupRows>(
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
