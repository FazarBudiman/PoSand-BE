import { Inject, Injectable } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../master-data/customer/domain/interface/customer.repository.interface';
import type { ICustomerRepository } from '../../master-data/customer/domain/interface/customer.repository.interface';
import { PRODUCT_VARIANT_REPOSITORY } from '../../inventory/product/domain/interface/product-variant.repository.interface';
import type { IProductVariantRepository } from '../../inventory/product/domain/interface/product-variant.repository.interface';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { ConflictException } from '../../../shared/exceptions/conflict.exception';
import { TRANSACTION_MANAGER } from '../../../shared/database/tokens/transaction.token';
import {
  PgTransactionContext,
  PgTransactionManager,
} from '../../../shared/database/transaction/pg-transaction.manager';
import { STOCK_MOVEMENT_REPOSITORY } from '../../inventory/product/domain/interface/stock-movement.repository.interface';
import type { IStockMovementRepository } from '../../inventory/product/domain/interface/stock-movement.repository.interface';
import { SALE_REPOSITORY } from '../domain/interface/sale.repository.interface';
import type { ISaleRepository } from '../domain/interface/sale.repository.interface';
import { SALE_ITEM_REPOSITORY } from '../domain/interface/sale-item.repository.interface';
import type { ISaleItemRepository } from '../domain/interface/sale-item.repository.interface';
import { CreateSaleRequestDto } from '../dto/request/sale.request.dto';
import { Sale } from '../domain/sale.entity';
import { SaleItem } from '../domain/sale-item.entity';
import { SaleRow } from '../repository/sale.row';

@Injectable()
export class SaleService {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,

    @Inject(SALE_ITEM_REPOSITORY)
    private readonly saleItemRepository: ISaleItemRepository,

    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,

    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: IProductVariantRepository,

    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private readonly stockMovementRepository: IStockMovementRepository,

    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: PgTransactionManager,
  ) {}

  async createSale(
    request: CreateSaleRequestDto,
    createdBy: string,
  ): Promise<SaleRow> {
    return this.transactionManager.runInTransaction(async (tx) => {
      // 1️⃣ cek customer
      const isCustomerExists = await this.customerRepository.existsCustomerById(
        request.customerId,
        tx as PgTransactionContext,
      );

      if (!isCustomerExists) {
        throw new NotFoundException('Customer not found');
      }

      const items: SaleItem[] = [];

      // 3️⃣ generate id
      const saleId = await this.saleRepository.getNextIdSale(
        tx as PgTransactionContext,
      );

      // 2️⃣ cek variant + stock
      for (const item of request.items) {
        const variant =
          await this.productVariantRepository.findProductVariantById(
            item.productVariantId,
            tx as PgTransactionContext,
          );

        if (!variant) {
          throw new NotFoundException('Product variant not found');
        }

        if (variant.quantity_stock && variant.quantity_stock < item.quantity) {
          throw new ConflictException('Stock not enough');
        }

        items.push(
          SaleItem.create({
            saleId: saleId,
            id: variant.product_id,
            productVariantId: variant.variant_id,
            quantity: item.quantity,
            unitPrice: variant.selling_price,
            discountType: item.discountType,
            discountValue: item.discountValue,
          }),
        );
      }

      // 4️⃣ create entity
      const sale = Sale.create({
        id: saleId,
        customerId: request.customerId,
        items,
        discountType: request.discountType,
        discountValue: request.discountValue,
        note: request.note,
      });

      // 5️⃣ insert sale
      const saleCreated = await this.saleRepository.createSale(
        sale,
        createdBy,
        tx as PgTransactionContext,
      );

      // 6️⃣ insert items
      await this.saleItemRepository.createSaleItems(
        items,
        tx as PgTransactionContext,
      );

      // 7️⃣ reduce stock
      await this.productVariantRepository.reduceStocks(
        items.map((item) => ({
          productVariantId: Number(item.productVariantId),
          quantity: Number(item.quantity),
        })),
        tx as PgTransactionContext,
      );

      // 8️⃣ insert stock movements
      await this.stockMovementRepository.insertOutStockMovements(
        items.map((item) => ({
          productVariantId: Number(item.productVariantId),
          quantity: item.quantity,
        })),
        saleId,
        createdBy,
        tx as PgTransactionContext,
      );

      return saleCreated;
    });
  }

  async findAllSales(): Promise<SaleRow[]> {
    return this.saleRepository.findAllSales();
  }
}
