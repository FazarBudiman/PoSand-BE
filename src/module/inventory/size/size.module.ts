import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SizeController } from './controller/size.controller';
import { SizeService } from './service/size.service';
import { SIZE_REPOSITORY } from './domain/interface/size.repository.interface';
import { SizeRepository } from './repository/size.repository';
import { SIZE_GROUP_REPOSITORY } from './domain/interface/size-group.repository.interface';
import { SizeGroupRepository } from './repository/size-gorup.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SizeController],
  providers: [
    SizeService,
    {
      provide: SIZE_REPOSITORY,
      useClass: SizeRepository,
    },
    {
      provide: SIZE_GROUP_REPOSITORY,
      useClass: SizeGroupRepository,
    },
  ],
  exports: [SizeService],
})
export class SizeModule {}
