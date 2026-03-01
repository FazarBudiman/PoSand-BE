import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ProductService } from './service/product.service';
import { PRODUCT_REPOSITORY } from './domain/interface/product.repository.interface';
import { ProductRepository } from './repository/product.repository';
import { ProductController } from './controller/product.controller';
import { PRODUCT_STOCK_REPOSITORY } from './domain/interface/product-stock.repository.interface';
import { ProductStockRepository } from './repository/product-stock.repository';

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
      provide: PRODUCT_STOCK_REPOSITORY,
      useClass: ProductStockRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
