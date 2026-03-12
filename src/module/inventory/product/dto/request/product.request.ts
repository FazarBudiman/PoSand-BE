import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1 })
  @IsNumberString()
  @IsNotEmpty()
  designId: number;

  @ApiProperty({ example: 1 })
  @IsNumberString()
  @IsNotEmpty()
  sizeGroupId: number;

  @ApiProperty({ example: 'Kaos Polos' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50000 })
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
  @ApiProperty({ example: 1 })
  @IsNumberString()
  @IsNotEmpty()
  sizeId: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  quantityStock: number;
}

export class ProductVariantCreateRequestDto {
  @ApiProperty({ type: [ProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  stock: ProductVariantDto[];
}
