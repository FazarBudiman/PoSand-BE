import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'user:read' })
  permissionName: string;
}
