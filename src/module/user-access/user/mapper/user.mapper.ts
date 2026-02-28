import { User } from '../domain/user.entity';
import { UserResponseDto } from '../dto/response/user.response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      roleName: user.roleName,
      permissions: user.permissions,
      isActive: user.isActive,
    };
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
