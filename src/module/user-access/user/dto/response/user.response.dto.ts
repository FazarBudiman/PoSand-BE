import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  fullname: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'ADMIN' })
  roleName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: ['user:read'], isArray: true })
  permissions: string[];
}
