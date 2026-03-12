import { ApiProperty } from '@nestjs/swagger';

export class StockInfoResponse {
  @ApiProperty({ example: '1' })
  sizeId: string;

  @ApiProperty({ example: 'XL' })
  sizeName: string;

  @ApiProperty({ example: 10 })
  quantity: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'https://example.com/image.png' })
  designReferenceImageUrl: string;

  @ApiProperty({ example: 'Kaos' })
  designCategory: string;

  @ApiProperty({ example: 'Adult Size' })
  sizeGroupName: string;

  @ApiProperty({ example: 'Kaos Polos' })
  name: string;

  @ApiProperty({ example: 50000 })
  sellingPrice: number;

  @ApiProperty({ type: [StockInfoResponse], required: false })
  stock?: StockInfoResponse[];
}
