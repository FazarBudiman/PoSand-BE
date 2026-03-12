import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_REPOSITORY } from './domain/interface/token.repository.interface';
import { TokenRepository } from './repository/token.repository';
import { PASSWORD_REPOSITORY } from './domain/interface/password.repository.interface';
import { PasswordRepository } from './repository/password.repository';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user-access/user/user.module';
import { AUTH_REPOSITORY } from './domain/interface/auth.repository.interface';
import { AuthRepository } from './repository/auth.repository';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionGuard } from '../../shared/guards/permission.guard';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    PermissionGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    {
      provide: PASSWORD_REPOSITORY,
      useClass: PasswordRepository,
    },
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
  ],
  exports: [
    TOKEN_REPOSITORY,
    PASSWORD_REPOSITORY,
    JwtAuthGuard,
    PermissionGuard,
  ],
})
export class AuthModule {}
