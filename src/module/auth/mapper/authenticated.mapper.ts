import { AuthenticatedResponseDto } from '../dto/response/authenticated.response';
import { AuthenticatedUserRow } from '../repository/auth.row';

export class AuthenticatedMapper {
  static toResponse(user: AuthenticatedUserRow): AuthenticatedResponseDto {
    return {
      id: user.id,
      username: user.username,
      role: user.role_name,
      permissions: user.permissions,
    };
  }
}
