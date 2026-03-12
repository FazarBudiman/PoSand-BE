import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CustomerCreateRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: '08123456789', required: false })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 1', required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: ['VIP', 'GROSIR'], isArray: true, required: false })
  @IsArray()
  @IsOptional()
  tags: string[];
}

export class CustomerUpdateRequestDto extends PartialType(
  CustomerCreateRequestDto,
) {}
