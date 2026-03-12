import { ApiProperty } from '@nestjs/swagger';

export class DesignResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Baju Batik' })
  name: string;

  @ApiProperty({ example: 'Desain batik modern' })
  description: string;

  @ApiProperty({ example: 'Batik' })
  category: string;

  @ApiProperty({ example: 'https://example.com/batik.png' })
  referenceImage: string;

  @ApiProperty({ example: 10000 })
  basePrice: number;
}
