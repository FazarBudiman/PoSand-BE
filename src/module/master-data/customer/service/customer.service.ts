import { Inject, Injectable } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../domain/interface/customer.repository.interface';
import type { ICustomerRepository } from '../domain/interface/customer.repository.interface';
import {
  CustomerCreateRequestDto,
  CustomerUpdateRequestDto,
} from '../dto/request/customer.request';
import { Customer } from '../domain/customer.entity';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';
import { TRANSACTION_MANAGER } from 'src/shared/database/tokens/transaction.token';
import type { ITransactionManager } from 'src/shared/database/transaction/transaction-manager.interface';
import { PgTransactionContext } from 'src/shared/database/transaction/pg-transaction.manager';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import { CustomerRow } from '../repository/customer.row';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: ITransactionManager,
  ) {}
  // Create Customer
  async createCustomer(body: CustomerCreateRequestDto): Promise<CustomerRow> {
    const isExist = await this.customerRepository.existsCustomerByFullname(
      body.fullname,
    );
    if (isExist) {
      throw new ConflictException(
        'Name customer is same',
        'RESOURCE_ALREADY_EXIST',
      );
    }

    const customer = Customer.create({
      fullname: body.fullname,
      phone: body.phone,
      address: body.address,
      tags: body.tags,
    });

    return await this.transactionManager.runInTransaction(async (tx) => {
      const customerCreated = await this.customerRepository.createCustomer(
        {
          fullname: customer.fullname,
          phone: customer.phone,
          address: customer.address,
        },
        tx as PgTransactionContext,
      );

      await this.customerRepository.createCustomerTags(
        customerCreated.id,
        customer.tags,
        tx as PgTransactionContext,
      );

      return customerCreated;
    });
  }

  // Get All Customers
  async findAllCustomers(): Promise<CustomerRow[]> {
    return await this.customerRepository.findAllCustomers();
  }

  // Get Customer by Id
  async findCustomerById(customerId: string): Promise<CustomerRow> {
    const customer = await this.customerRepository.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException(
        'Customer tidak ditemukan',
        'RESOURCE_NOT_FOUND',
      );
    }
    return customer;
  }

  // Update Customer by Id
  async updateCustomerById(
    customerId: string,
    body: CustomerUpdateRequestDto,
  ): Promise<CustomerRow> {
    await this.transactionManager.runInTransaction(async (tx) => {
      if (body.fullname !== undefined) {
        const isExist = await this.customerRepository.existsCustomerByFullname(
          body.fullname,
        );
        if (isExist) {
          throw new ConflictException(
            'Name customer is same',
            'RESOURCE_ALREADY_EXIST',
          );
        }
      }

      const customer = Customer.update({
        fullname: body.fullname,
        phone: body.phone,
        address: body.address,
        tags: body.tags,
      });
      await this.customerRepository.updateCustomerById(
        customerId,
        customer,
        tx as PgTransactionContext,
      );

      if (customer.tags !== undefined) {
        await this.customerRepository.deleteCustomerTagsById(
          customerId,
          tx as PgTransactionContext,
        );
        await this.customerRepository.createCustomerTags(
          customerId,
          customer.tags,
          tx as PgTransactionContext,
        );
      }
    });
    const customerUpdated =
      await this.customerRepository.findCustomerById(customerId);
    if (!customerUpdated) {
      throw new NotFoundException('Customer not found', 'RESOURCE_NOT_FOUND');
    }
    return customerUpdated;
  }

  // Delete Customer by Id
  async deleteCustomerById(customerId: string): Promise<void> {
    const success =
      await this.customerRepository.deleteCustomerById(customerId);
    if (!success) {
      throw new NotFoundException(
        'Customer tidak ditemukan',
        'RESOURCE_NOT_FOUND',
      );
    }
  }
}
