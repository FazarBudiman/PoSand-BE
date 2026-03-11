import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserRow } from '../repository/user.row';

export class UserMapper {
  static toResponse(user: UserRow): UserResponseDto {
    return {
      id: user.id,
      fullname: user.full_name,
      username: user.username,
      roleName: user.role_name,
      permissions: user.permission_name,
      isActive: user.is_active,
    };
  }

  static toResponseList(users: UserRow[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
