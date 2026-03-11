import { PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
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

// Request Update Product
export class ProductUpdateRequestDto extends PartialType(
  PickType(ProductCreateRequestDto, ['name', 'sellingPrice'] as const),
) {}

// Request Add Product Variant (Stock)
export class ProductVariantDto {
  @IsNumberString()
  @IsNotEmpty()
  sizeId: number;

  @IsNumber()
  @IsNotEmpty()
  quantityStock: number;
}

export class ProductVariantCreateRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  stock: ProductVariantDto[];
}
