import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'ADMIN' })
  role: string;

  @ApiProperty({ example: ['user:read', 'user:write'], isArray: true })
  permissions: string[];
}
