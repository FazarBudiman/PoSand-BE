import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class DesignCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsNumberString()
  @IsNotEmpty()
  basePrice: number;
}

export class DesignUpdateRequestDto extends PartialType(
  DesignCreateRequestDto,
) {}
