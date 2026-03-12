import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { DiscountType } from '../../domain/type/discount-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleItemRequestDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  productId: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  productVariantId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: DiscountType, required: false, example: 'PERCENTAGE' })
  @IsOptional()
  @IsString()
  discountType: DiscountType;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  discountValue: number;
}

export class CreateSaleRequestDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  customerId: string;

  @ApiProperty({ enum: DiscountType, required: false, example: 'FIXED' })
  @IsOptional()
  @IsString()
  discountType: DiscountType;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  discountValue: number;

  @ApiProperty({ example: 'Penjualan grosir' })
  @IsNotEmpty()
  @IsString()
  note: string;

  @ApiProperty({ type: [CreateSaleItemRequestDto] })
  @IsNotEmpty()
  @IsArray()
  items: CreateSaleItemRequestDto[];
}
