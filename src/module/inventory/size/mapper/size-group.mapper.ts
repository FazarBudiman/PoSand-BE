import { SizeGroup } from '../domain/size-group.entity';
import { SizeGroupResponseDto } from '../dto/response/size.response';

export class SizeGroupMapper {
  static toResponse(rows: SizeGroup): SizeGroupResponseDto {
    return {
      id: rows.id,
      groupName: rows.groupName,
      sizes: rows.sizes.map((size) => ({
        id: size.id,
        sizeName: size.sizeName,
      })),
    };
  }

  static toResponseList(rows: SizeGroup[]): SizeGroupResponseDto[] {
    return rows.map((row) => ({
      id: row.id,
      groupName: row.groupName,
      sizes: row.sizes.map((size) => ({
        id: size.id,
        sizeName: size.sizeName,
      })),
    }));
  }
}
