import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../shared/database/database.module';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { ROLE_REPOSITORY } from './domain/interface/role.respository.interface';
import { RoleRepository } from './repository/role.repository';
import { PERMISSION_REPOSITORY } from './domain/interface/permission.repository.interface';
import { PermissionRepository } from './repository/permission.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
