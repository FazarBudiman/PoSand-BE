import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/interface/product.repository.interface';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { ProductRow } from './product.row';
import { Product } from '../domain/product.entity';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';

const PRODUCT_WITH_VARIANTS_QUERY = `
  SELECT
    p.id,
    p.name,
    p.selling_price,
    d.reference_image_url,
    d.design_category,
    sg.group_name,
    COALESCE(
      json_agg(
        json_build_object(
          'variant_id', pv.id,
          'size_id', pv.size_id,
          'size_name', s.size_name,
          'quantity_stock', pv.quantity_stock
        )
      ) FILTER (WHERE pv.id IS NOT NULL),
      '[]'
    ) as variants
  FROM products p
    JOIN designs d ON p.design_id = d.id
    JOIN size_groups sg ON p.size_group_id = sg.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN sizes s ON pv.size_id = s.id
`;

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  async createProduct(
    product: Product,
    userWhoCreated: string,
  ): Promise<ProductRow> {
    const { rows } = await this.pool.query<ProductRow>(
      `
      WITH inserted AS (
        INSERT INTO products (name, selling_price, design_id, size_group_id, created_by) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING 
          id,
          name,
          selling_price,
          design_id,
          size_group_id
      )
      SELECT 
        i.*, d.reference_image_url, d.design_category, sg.group_name
      FROM inserted i
      JOIN designs d ON i.design_id = d.id
      JOIN size_groups sg ON i.size_group_id = sg.id;
    `,
      [
        product.name,
        product.sellingPrice,
        product.designId,
        product.sizeGroupId,
        userWhoCreated,
      ],
    );
    return rows[0];
  }

  async findAllProducts(): Promise<ProductRow[]> {
    const { rows } = await this.pool.query<ProductRow>(`
      ${PRODUCT_WITH_VARIANTS_QUERY}
      WHERE p.is_deleted = false
      GROUP BY p.id, d.reference_image_url, d.design_category, sg.group_name;
    `);
    return rows;
  }

  async findProductById(
    id: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductRow | undefined> {
    const client = txContext || this.pool;
    const { rows } = await client.query<ProductRow>(
      `
      ${PRODUCT_WITH_VARIANTS_QUERY}
      WHERE p.id = $1 AND p.is_deleted = false
      GROUP BY p.id, d.reference_image_url, d.design_category, sg.group_name;
    `,
      [id],
    );
    if (!rows.length) return undefined;
    return rows[0];
  }

  async existsProductById(id: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `
      SELECT EXISTS(
        SELECT 1
        FROM products p
        WHERE p.id = $1 AND p.is_deleted = false
      );
    `,
      [id],
    );
    return rows[0].exists;
  }

  async updateProductById(
    id: string,
    product: Partial<Product>,
    updatedBy: string,
  ): Promise<ProductRow | undefined> {
    const { name, sellingPrice } = product;
    const values: any[] = [];
    let query = `UPDATE products SET updated_by = $1, updated_at = NOW()`;
    let index = 2;
    if (name) {
      query += `, name = $${index++}`;
      values.push(name);
    }
    if (sellingPrice) {
      query += `, selling_price = $${index++}`;
      values.push(sellingPrice);
    }
    query += ` WHERE id = $${index++} AND is_deleted = false RETURNING id`;
    values.push(id);
    values.unshift(updatedBy);

    const { rows } = await this.pool.query<{ id: string }>(query, values);
    if (rows.length === 0) return undefined;

    return this.findProductById(rows[0].id);
  }

  async deleteProductById(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `
      UPDATE products
      SET is_deleted = true
      WHERE id = $1;
      `,
      [id],
    );
    return rowCount !== null && rowCount > 0;
  }
}
