import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { UserModule } from './module/user-access/user/user.module';
import { RoleModule } from './module/user-access/role/role.module';
import { SharedModule } from './shared/shared.module';
import { PermissionGuard } from './shared/guards/permission.guard';
import { DesignModule } from './module/master-data/design/design.module';
import { SizeModule } from './module/inventory/size/size.module';
import { ProductModule } from './module/inventory/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    RoleModule,
    DesignModule,
    SizeModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
