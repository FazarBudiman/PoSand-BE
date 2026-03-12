import { Inject, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../domain/interface/customer.repository.interface';
import { PG_POOL } from '../../../../shared/database/tokens/pg.token';
import { Pool } from 'pg';
import { Customer } from '../domain/customer.entity';
import { PgTransactionContext } from '../../../../shared/database/transaction/pg-transaction.manager';
import { CustomerRow } from './customer.row';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async existsCustomerById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<boolean> {
    const client = txContext || this.pool;
    const { rowCount } = await client.query(
      `SELECT id FROM customers c WHERE c.id = $1`,
      [customerId],
    );
    return rowCount !== null && rowCount > 0;
  }

  async existsCustomerByFullname(
    fullname: string,
    txContext?: PgTransactionContext,
  ): Promise<boolean> {
    const client = txContext || this.pool;
    const { rowCount } = await client.query(
      `SELECT id from customers c WHERE c.fullname = $1`,
      [fullname],
    );
    return rowCount !== null && rowCount > 0;
  }

  async createCustomer(
    customer: Omit<Customer, 'tags'>,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow> {
    const client = txContext || this.pool;

    const { rows } = await client.query<CustomerRow>(
      `INSERT INTO customers (fullname, phone, address) 
        VALUES ($1, $2, $3) RETURNING *`,
      [customer.fullname, customer.phone, customer.address],
    );

    return rows[0];
  }

  async createCustomerTags(
    customerId: string,
    tags?: string[],
    txContext?: PgTransactionContext,
  ): Promise<void> {
    const client = txContext || this.pool;
    if (!tags || tags.length === 0) return;
    await client.query(
      `
      INSERT INTO customer_tags(customer_id, tag)
      SELECT $1, unnest ($2::text[])
      ON CONFLICT (customer_id, tag) DO NOTHING
    `,
      [customerId, tags],
    );
  }

  async findAllCustomers(): Promise<CustomerRow[]> {
    const { rows } = await this.pool.query<CustomerRow>(
      `SELECT
        c.id, c.fullname,
        c.phone, c.address,
      COALESCE(array_agg(ct.tag) FILTER (WHERE ct.tag IS NOT NULL), '{}') AS tags
      FROM customers c
      LEFT JOIN customer_tags ct
        ON c.id = ct.customer_id
      GROUP BY c.id`,
    );
    return rows;
  }

  async findCustomerById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow | undefined> {
    const client = txContext || this.pool;
    const { rows } = await client.query<CustomerRow>(
      `SELECT
        c.id, c.fullname,
        c.phone, c.address,
      COALESCE(array_agg(ct.tag) FILTER (WHERE ct.tag IS NOT NULL), '{}') AS tags
      FROM customers c
      LEFT JOIN customer_tags ct
        ON c.id = ct.customer_id
      WHERE c.id = $1
      GROUP BY c.id
    `,
      [customerId],
    );

    if (rows.length === 0) return undefined;

    return rows[0];
  }

  async deleteCustomerTagsById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<void> {
    const client = txContext || this.pool;
    await client.query(`DELETE FROM customer_tags WHERE customer_id = $1`, [
      customerId,
    ]);
  }

  async updateCustomerById(
    customerId: string,
    customer: Omit<Customer, 'tags'>,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow | undefined> {
    const client = txContext || this.pool;
    const values: any[] = [];
    let query = `UPDATE customers SET updated_at = NOW()`;
    let index = 1;

    if (customer.fullname !== undefined) {
      query += `, fullname = $${index}`;
      values.push(customer.fullname);
      index++;
    }

    if (customer.phone !== undefined) {
      query += `, phone = $${index}`;
      values.push(customer.phone);
      index++;
    }

    if (customer.address !== undefined) {
      query += `, address = $${index}`;
      values.push(customer.address);
      index++;
    }

    query += ` WHERE id = $${index} RETURNING *`;
    values.push(customerId);

    const { rows } = await client.query<CustomerRow>(query, values);
    if (rows.length === 0) {
      return undefined;
    }

    return rows[0];
  }

  async deleteCustomerById(customerId: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `DELETE FROM customers WHERE id = $1`,
      [customerId],
    );
    return rowCount !== null && rowCount > 0;
  }
}
