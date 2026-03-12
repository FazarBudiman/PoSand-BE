import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class DesignCreateRequestDto {
  @ApiProperty({ example: 'Baju Batik' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Desain batik modern', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'Batik', required: false })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ example: 10000 })
  @IsNumberString()
  @IsNotEmpty()
  basePrice: number;
}

export class DesignUpdateRequestDto extends PartialType(
  DesignCreateRequestDto,
) {}
