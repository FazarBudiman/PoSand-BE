import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/interface/product.repository.interface';
import { PG_POOL } from 'src/shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Product } from '../domain/product.entity';
import {
  ProductCreateRequestDto,
  ProductVariantCreateRequestDto,
} from '../dto/request/product.request';
import { ProductVariant } from '../domain/product-variant.entity';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { MovementType } from 'src/shared/types/movement-type.enum';

interface VariantRow {
  id: string;
  size_id: string;
  size_name: string;
  quantity_stock: number;
}

interface ProductRow {
  id: string;
  name: string;
  selling_price: number;
  reference_image_url: string;
  design_category: string;
  group_name: string;
  variants?: VariantRow[];
}

function mapToEntityProduct(row: ProductRow): Product {
  const product = new Product(
    row.id,
    row.reference_image_url,
    row.design_category,
    row.group_name,
    row.name,
    row.selling_price,
  );
  if (row.variants) {
    product.variants = row.variants.map(
      (v) =>
        new ProductVariant({
          id: v.id,
          sizeId: v.size_id,
          sizeName: v.size_name,
          quantityStock: v.quantity_stock,
        }),
    );
  }
  return product;
}

interface ProductVariantRow {
  id: string;
  product_id: string;
  size_id: string;
  quantity_stock: number;
}

function mapToEntityProductVariant(row: ProductVariantRow): ProductVariant {
  return new ProductVariant({
    id: row.id,
    productId: row.product_id,
    sizeId: row.size_id,
    quantityStock: row.quantity_stock,
  });
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  async createProduct(
    product: ProductCreateRequestDto,
    userWhoCreated: string,
  ): Promise<Product> {
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
    return mapToEntityProduct(rows[0]);
  }

  async getAllProduct(): Promise<Product[]> {
    const { rows } = await this.pool.query<ProductRow>(`
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
              'id', pv.id,
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
      WHERE p.is_deleted = false
      GROUP BY p.id, d.reference_image_url, d.design_category, sg.group_name;
    `);
    return rows.map((row) => mapToEntityProduct(row));
  }

  async isProductExist(id: string): Promise<boolean | undefined> {
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

  async getProductById(id: string): Promise<Product> {
    const { rows } = await this.pool.query<ProductRow>(
      `
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
              'id', pv.id,
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
      WHERE p.id = $1 AND p.is_deleted = false
      GROUP BY p.id, d.reference_image_url, d.design_category, sg.group_name;
    `,
      [id],
    );
    if (!rows.length) {
      throw new Error('Product not found');
    }
    return mapToEntityProduct(rows[0]);
  }

  async createProductVariant(
    productId: string,
    productVariant: ProductVariantCreateRequestDto,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<ProductVariant[]> {
    const { stock } = productVariant;
    const client = txContext || this.pool;

    const values: string[] = [];
    const params: any[] = [];
    let i = 1;
    for (const item of stock) {
      values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
      params.push(productId, item.sizeId, item.quantity, userWhoCreated);
    }

    const { rows } = await client.query<ProductVariantRow>(
      `
      INSERT INTO product_variants (product_id, size_id, quantity_stock, created_by) 
      VALUES ${values.join(', ')}
      RETURNING id, product_id, size_id, quantity_stock;
    `,
      params,
    );
    return rows.map((row) => mapToEntityProductVariant(row));
  }

  async insertStockMovements(
    variants: ProductVariant[],
    referenceType: string,
    referenceId: string,
    userWhoCreated: string,
    txContext?: PgTransactionContext,
  ): Promise<void> {
    const client = txContext || this.pool;

    const values: string[] = [];
    const params: any[] = [];
    let i = 1;

    for (const variant of variants) {
      values.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
      params.push(
        variant.id,
        variant.quantityStock, // The quantity just inserted
        MovementType.IN,
        referenceType,
        referenceId,
        userWhoCreated,
      );
    }

    await client.query(
      `
      INSERT INTO stock_movements (product_variant_id, quantity, type, reference_type, reference_id, created_by)
      VALUES ${values.join(', ')}
      `,
      params,
    );
  }

  async updateProductById(
    id: string,
    product: Pick<ProductCreateRequestDto, 'name' | 'sellingPrice'>,
    userWhoUpdated: string,
  ): Promise<Product | undefined> {
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
    values.unshift(userWhoUpdated);

    const { rows } = await this.pool.query<{ id: string }>(query, values);
    if (rows.length === 0) return undefined;

    return this.getProductById(rows[0].id);
  }

  async hasActiveStock(id: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ exists: boolean }>(
      `
      SELECT EXISTS(
        SELECT 1 
        FROM product_variants 
        WHERE product_id = $1 AND quantity_stock > 0
      );
      `,
      [id],
    );
    return rows[0].exists;
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
