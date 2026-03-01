import { Size } from '../../domain/size.entity';

export class SizeResponseDto {
  id: string;
  sizeName: string;
}

export class SizeGroupResponseDto {
  id: string;
  groupName: string;
  sizes: Size[];
}
