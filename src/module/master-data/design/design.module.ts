import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../shared/database/database.module';
import { DesignController } from './controller/design.controller';
import { DesignService } from './service/design.service';
import { DESIGN_REPOSITORY } from './domain/interface/design.repository.interface';
import { DesignRepository } from './repository/design.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [DesignController],
  providers: [
    DesignService,
    {
      provide: DESIGN_REPOSITORY,
      useClass: DesignRepository,
    },
  ],
  exports: [DesignService],
})
export class DesignModule {}
