import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  fullname: string;

  @ApiProperty({ example: '08123456789', required: false })
  phone?: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 1', required: false })
  address?: string;

  @ApiProperty({ example: ['VIP'], isArray: true, required: false })
  tags?: string[];
}
