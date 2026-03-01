import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

// Request Create Product
export class ProductCreateRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  designId: number;

  @IsNumberString()
  @IsNotEmpty()
  sizeGroupId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;
}

export class ProductUpdateRequestDto extends PartialType(
  ProductCreateRequestDto,
) {}

// Request Add Product Variant (Stock)
export class ProductVariantDto {
  @IsNumberString()
  @IsNotEmpty()
  sizeId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class ProductVariantCreateRequestDto {
  @IsArray()
  stock: ProductVariantDto[];
}
