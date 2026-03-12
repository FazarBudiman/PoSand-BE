import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { CUSTOMER_REPOSITORY } from '../master-data/customer/domain/interface/customer.repository.interface';
import { CustomerRepository } from '../master-data/customer/repository/customer.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../inventory/product/domain/interface/product-variant.repository.interface';
import { ProductVariantRepository } from '../inventory/product/repository/product-variant.repository';
import { STOCK_MOVEMENT_REPOSITORY } from '../inventory/product/domain/interface/stock-movement.repository.interface';
import { StockMovementRepository } from '../inventory/product/repository/stock-movement.repository';
import { PAYMENT_REPOSITORY } from '../finance/payment/domain/interface/payment.repository.interface';
import { PaymentRepository } from '../finance/payment/repository/payment.repository';
import { CASHFLOW_REPOSITORY } from '../finance/cashflow/domain/interface/cashflow.repository.interface';
import { CashflowRepository } from '../finance/cashflow/repository/cashflow.repository';
import { SaleController } from './controller/sale.controller';
import { SaleService } from './service/sale.service';
import { SalePaymentService } from './service/sale-payment.service';
import { SaleReceiptService } from './service/sale-receipt.service';
import { SALE_REPOSITORY } from './domain/interface/sale.repository.interface';
import { SaleRepository } from './repository/sale.repository';
import { SALE_ITEM_REPOSITORY } from './domain/interface/sale-item.repository.interface';
import { SaleItemRepository } from './repository/sale-item.repository';
import { SALE_RECEIPT_REPOSITORY } from './domain/interface/sale-receipt.repository.interface';
import { SaleReceiptRepository } from './repository/sale-receipt.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SaleController],
  providers: [
    SaleService,
    SalePaymentService,
    SaleReceiptService,
    {
      provide: SALE_REPOSITORY,
      useClass: SaleRepository,
    },
    {
      provide: SALE_ITEM_REPOSITORY,
      useClass: SaleItemRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: PRODUCT_VARIANT_REPOSITORY,
      useClass: ProductVariantRepository,
    },
    {
      provide: STOCK_MOVEMENT_REPOSITORY,
      useClass: StockMovementRepository,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
    {
      provide: CASHFLOW_REPOSITORY,
      useClass: CashflowRepository,
    },
    {
      provide: SALE_RECEIPT_REPOSITORY,
      useClass: SaleReceiptRepository,
    },
  ],
  exports: [SaleService, SalePaymentService, SaleReceiptService],
})
export class SaleModule {}
