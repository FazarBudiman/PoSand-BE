import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ParamsRoleRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}

export class CreateRoleRequestDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

export class UpdateRoleRequestDto extends PartialType(CreateRoleRequestDto) {}
