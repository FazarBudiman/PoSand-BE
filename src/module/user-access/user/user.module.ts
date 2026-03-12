import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { USER_REPOSITORY } from './domain/interfaces/user.repository.interface';
import { UserRepository } from './repository/user.repository';
import { DatabaseModule } from '../../../shared/database/database.module';
import { PASSWORD_REPOSITORY } from '../../auth/domain/interface/password.repository.interface';
import { PasswordRepository } from '../../auth/repository/password.repository';
import { UserController } from './controller/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PASSWORD_REPOSITORY,
      useClass: PasswordRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
