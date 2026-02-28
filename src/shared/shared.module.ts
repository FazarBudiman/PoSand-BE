import { Global, Module } from '@nestjs/common';
// import { PermissionGuard } from './guards/permission.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { AuthModule } from 'src/module/auth/auth.module';

@Global()
@Module({
  // imports: [AuthModule],
  // providers: [PermissionGuard, JwtAuthGuard],
  // exports: [PermissionGuard, JwtAuthGuard],
})
export class SharedModule {}
