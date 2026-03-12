import { Global, Module } from '@nestjs/common';
// import { PermissionGuard } from './guards/permission.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { AuthModule } from '../module/auth/auth.module';

import { StorageModule } from './storage/storage.module';

@Global()
@Module({
  imports: [StorageModule],
  exports: [StorageModule],
})
export class SharedModule {}
