import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain/interfaces/user.repository.interface';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { PASSWORD_REPOSITORY } from 'src/module/auth/domain/interface/password.repository.interface';
import type { IPasswordRepository } from 'src/module/auth/domain/interface/password.repository.interface';
import { User } from '../domain/user.entity';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import {
  CreateUserRequestDto,
  ParamUserRequestDto,
  PatchUserRequestDto,
} from '../dto/request/user.request.dto';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(PASSWORD_REPOSITORY)
    private readonly passwordRepository: IPasswordRepository,
  ) {}

  async create(body: CreateUserRequestDto): Promise<User> {
    const isUsernameExist = await this.userRepository.isUsernameExist({
      username: body.username,
    });

    if (isUsernameExist) {
      throw new ConflictException(
        'Username sudah digunakan',
        'RESOURCE_ALREADY_EXIST',
      );
    }
    const passwordHash = await this.passwordRepository.hash(body.password);

    return await this.userRepository.create({
      fullname: body.fullname,
      username: body.username,
      password: passwordHash,
      roleId: body.roleId,
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async getUserById(params: ParamUserRequestDto): Promise<User> {
    const user = await this.userRepository.getUserById(params.id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
    return user;
  }

  async updateUserById(
    params: ParamUserRequestDto,
    body: PatchUserRequestDto,
  ): Promise<User> {
    const user = await this.userRepository.updateUserById(params.id, body);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
    return user;
  }

  async deleteUserById(params: ParamUserRequestDto): Promise<void> {
    const success = await this.userRepository.deleteUserById(params.id);
    if (!success) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
  }
}
