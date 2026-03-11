import { Inject, Injectable } from '@nestjs/common';
import { IDesignRepository } from '../domain/interface/design.repository.interface';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Design } from '../domain/design.entity';
import { DesignRow } from './design.row';

@Injectable()
export class DesignRepository implements IDesignRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAllDesigns(): Promise<DesignRow[]> {
    const { rows } = await this.pool.query<DesignRow>(
      `SELECT 
        id, design_name, design_description, 
        design_category, reference_image_url, 
        base_price_estimation 
      FROM designs 
      WHERE is_deleted = false`,
    );
    return rows;
  }

  async existsDesignByName(name: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `SELECT id FROM designs WHERE design_name = $1 `,
      [name],
    );
    return rowCount !== null && rowCount > 0;
  }

  async createDesign(design: Design, createdBy: string): Promise<DesignRow> {
    const { rows } = await this.pool.query<DesignRow>(
      `INSERT INTO designs (
        design_name, 
        design_description, 
        design_category, 
        reference_image_url, 
        base_price_estimation, 
        created_by
      )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [
        design.name,
        design.description,
        design.category,
        design.referenceImageUrl,
        design.basePrice,
        createdBy,
      ],
    );
    return rows[0];
  }

  async findDesignById(id: string): Promise<DesignRow | undefined> {
    const { rows } = await this.pool.query<DesignRow>(
      `SELECT 
        id, design_name, design_description, 
        design_category, reference_image_url, 
        base_price_estimation 
      FROM designs 
      WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    if (rows.length === 0) return undefined;
    return rows[0];
  }

  async updateDesignById(
    id: string,
    design: Partial<Design>,
    updatedBy: string,
  ): Promise<DesignRow | undefined> {
    const values: any[] = [];
    let query = `UPDATE designs SET updated_by = $1, updated_at = NOW()`;
    let index = 2;

    if (design.name) {
      query += `, design_name = $${index}`;
      values.push(design.name);
      index++;
    }
    if (design.description) {
      query += `, design_description = $${index}`;
      values.push(design.description);
      index++;
    }
    if (design.category) {
      query += `, design_category = $${index}`;
      values.push(design.category);
      index++;
    }
    if (design.referenceImageUrl) {
      query += `, reference_image_url = $${index}`;
      values.push(design.referenceImageUrl);
      index++;
    }
    if (design.basePrice) {
      query += `, base_price_estimation = $${index}`;
      values.push(design.basePrice);
      index++;
    }

    query += ` WHERE id = $${index} AND is_deleted = false RETURNING *`;
    values.push(id);
    values.unshift(updatedBy);

    const { rows } = await this.pool.query<DesignRow>(query, values);
    if (rows.length === 0) return undefined;
    return rows[0];
  }

  async deleteDesignById(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `UPDATE designs SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING id`,
      [id],
    );
    return rowCount !== null && rowCount > 0;
  }
}
