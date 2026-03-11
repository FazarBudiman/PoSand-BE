import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain/interfaces/user.repository.interface';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { PASSWORD_REPOSITORY } from 'src/module/auth/domain/interface/password.repository.interface';
import type { IPasswordRepository } from 'src/module/auth/domain/interface/password.repository.interface';
import { User } from '../domain/user.entity';
import { NotFoundException } from 'src/shared/exceptions/not-found.exception';
import {
  CreateUserRequestDto,
  PatchUserRequestDto,
} from '../dto/request/user.request.dto';
import { ConflictException } from 'src/shared/exceptions/conflict.exception';
import { UserRow } from '../repository/user.row';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(PASSWORD_REPOSITORY)
    private readonly passwordRepository: IPasswordRepository,
  ) {}

  // Create User
  async createUser(body: CreateUserRequestDto): Promise<UserRow> {
    const isUsernameExist = await this.userRepository.existsUserByUsername(
      body.username,
    );
    if (isUsernameExist) {
      throw new ConflictException(
        'Username sudah digunakan',
        'RESOURCE_ALREADY_EXIST',
      );
    }
    const passwordHash = await this.passwordRepository.hash(body.password);

    const user = User.create({
      fullname: body.fullname,
      username: body.username,
      passwordHash: passwordHash,
      roleId: body.roleId,
    });

    return this.userRepository.createUser(user);
  }

  // Find All Users
  async findAllUsers(): Promise<UserRow[]> {
    return this.userRepository.findAllUsers();
  }

  // Find User by Id
  async findUserById(id: string): Promise<UserRow> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
    return user;
  }

  // Update User by Id
  async updateUserById(
    id: string,
    body: PatchUserRequestDto,
  ): Promise<UserRow> {
    const user = await this.userRepository.updateUserById(id, body);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
    return user;
  }

  // Delete User by Id
  async deleteUserById(id: string): Promise<void> {
    const success = await this.userRepository.deleteUserById(id);
    if (!success) {
      throw new NotFoundException('User tidak ditemukan', 'RESOURCE_NOT_FOUND');
    }
  }
}
