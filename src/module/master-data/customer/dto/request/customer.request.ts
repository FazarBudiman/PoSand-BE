import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CustomerCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsArray()
  @IsOptional()
  tags: string[];
}

export class CustomerUpdateRequestDto extends PartialType(
  CustomerCreateRequestDto,
) {}
