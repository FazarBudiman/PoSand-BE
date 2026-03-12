import { ApiProperty } from '@nestjs/swagger';

export class SizeResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'XL' })
  sizeName: string;
}

export class SizeGroupResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Adult Size' })
  groupName: string;

  @ApiProperty({ type: [SizeResponseDto] })
  sizes: SizeResponseDto[];
}
