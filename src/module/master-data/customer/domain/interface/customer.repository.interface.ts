import { PgTransactionContext } from '../../../../../shared/database/transaction/pg-transaction.manager';
import { Customer } from '../customer.entity';
import { CustomerRow } from '../../repository/customer.row';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface ICustomerRepository {
  createCustomer(
    customer: Omit<Customer, 'tags'>,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow>;

  createCustomerTags(
    customerId: string,
    tags?: string[],
    txContext?: PgTransactionContext,
  ): Promise<void>;

  existsCustomerByFullname(
    fullname: string,
    txContext?: PgTransactionContext,
  ): Promise<boolean>;

  existsCustomerById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<boolean>;

  findAllCustomers(): Promise<CustomerRow[]>;

  findCustomerById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow | undefined>;

  updateCustomerById(
    customerId: string,
    customer: Partial<Customer>,
    txContext?: PgTransactionContext,
  ): Promise<CustomerRow | undefined>;

  deleteCustomerTagsById(
    customerId: string,
    txContext?: PgTransactionContext,
  ): Promise<void>;

  deleteCustomerById(customerId: string): Promise<boolean>;
}
