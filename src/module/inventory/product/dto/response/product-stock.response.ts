import { ApiProperty } from '@nestjs/swagger';

export class ProductStockResponseDto {
  @ApiProperty({ example: '1' })
  productId: string;

  @ApiProperty({ example: 'Kaos Polos' })
  productName: string;

  @ApiProperty({ example: '1' })
  variantId: string;

  @ApiProperty({ example: 'XL' })
  sizeName: string;

  @ApiProperty({ example: 10 })
  quantityStock: number;

  @ApiProperty({ example: [], isArray: true })
  stockHistory: [];
}
