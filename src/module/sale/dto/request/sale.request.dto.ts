import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { DiscountType } from '../../domain/type/discount-type.enum';

export class CreateSaleItemRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  productId: string;

  @IsNotEmpty()
  @IsNumberString()
  productVariantId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  discountType: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue: number;
}

export class CreateSaleRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  customerId: string;

  @IsOptional()
  @IsString()
  discountType: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue: number;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsArray()
  items: CreateSaleItemRequestDto[];
}
