import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from './permission.response.dto';

export class RoleResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'ADMIN' })
  roleName: string;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[];
}
