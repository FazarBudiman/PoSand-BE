import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SizeCreateRequestDto {
  @ApiProperty({ example: 'Adult Size' })
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiProperty({ example: ['S', 'M', 'L', 'XL'], isArray: true })
  @IsArray()
  @IsNotEmpty()
  sizes: string[];
}

export class SizeUpdateRequestDto extends PartialType(SizeCreateRequestDto) {}
