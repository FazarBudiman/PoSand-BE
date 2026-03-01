import { User } from 'src/module/user-access/user/domain/user.entity';
import { AuthenticatedResponseDto } from '../dto/response/authenticated.response';

export class AuthenticatedMapper {
  static toResponse(user: User): AuthenticatedResponseDto {
    return {
      id: user.id,
      username: user.username,
      role: user.roleName,
      permissions: user.permissions,
    };
  }
}
