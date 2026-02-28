import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { ROLE_REPOSITORY } from './domain/interface/role.respository.interface';
import { RoleRepository } from './repository/role.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
