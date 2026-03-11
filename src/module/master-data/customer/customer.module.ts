import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { CustomerController } from './controller/customer.controller';
import { CustomerService } from './service/customer.service';
import { CUSTOMER_REPOSITORY } from './domain/interface/customer.repository.interface';
import { CustomerRepository } from './repository/customer.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
