import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SizeCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsArray()
  @IsNotEmpty()
  sizes: string[];
}

export class SizeUpdateRequestDto extends PartialType(SizeCreateRequestDto) {}
