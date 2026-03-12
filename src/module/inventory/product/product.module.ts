import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../shared/database/database.module';
import { ProductService } from './service/product.service';
import { PRODUCT_REPOSITORY } from './domain/interface/product.repository.interface';
import { ProductRepository } from './repository/product.repository';
import { PRODUCT_VARIANT_REPOSITORY } from './domain/interface/product-variant.repository.interface';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { STOCK_MOVEMENT_REPOSITORY } from './domain/interface/stock-movement.repository.interface';
import { StockMovementRepository } from './repository/stock-movement.repository';
import { PRODUCT_STOCK_REPOSITORY } from './domain/interface/product-stock.repository.interface';
import { ProductStockRepository } from './repository/product-stock.repository';
import { ProductController } from './controller/product.controller';
import { SIZE_REPOSITORY } from '../size/domain/interface/size.repository.interface';
import { SizeRepository } from '../size/repository/size.repository';
import { SIZE_GROUP_REPOSITORY } from '../size/domain/interface/size-group.repository.interface';
import { SizeGroupRepository } from '../size/repository/size-gorup.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: SIZE_REPOSITORY,
      useClass: SizeRepository,
    },
    {
      provide: SIZE_GROUP_REPOSITORY,
      useClass: SizeGroupRepository,
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
      provide: PRODUCT_STOCK_REPOSITORY,
      useClass: ProductStockRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
