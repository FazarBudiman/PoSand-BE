import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ParamsRoleRequestDto {
  @ApiProperty({ example: '1' })
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}

export class CreateRoleRequestDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({ example: ['user:read', 'user:create'], isArray: true })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

export class UpdateRoleRequestDto extends PartialType(CreateRoleRequestDto) {}
