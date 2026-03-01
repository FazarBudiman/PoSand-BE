import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SizeController } from './controller/size.controller';
import { SizeService } from './service/size.service';
import { SIZE_REPOSITORY } from './domain/interface/size.repository.interface';
import { SizeRepository } from './repository/size.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SizeController],
  providers: [
    SizeService,
    {
      provide: SIZE_REPOSITORY,
      useClass: SizeRepository,
    },
  ],
  exports: [SizeService],
})
export class SizeModule {}
