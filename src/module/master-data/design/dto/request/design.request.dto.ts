import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class DesignCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @IsString()
  @IsNotEmpty()
  referenceImage: string;
}

export class DesignUpdateRequestDto extends PartialType(
  DesignCreateRequestDto,
) {}

export class ParamsDesignRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}
