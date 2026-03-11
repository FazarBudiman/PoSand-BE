import { SizeGroupResponseDto } from '../dto/response/size.response';
import { SizeGroupRow } from '../repository/size-group.row';

export class SizeGroupMapper {
  static toResponse(row: SizeGroupRow): SizeGroupResponseDto {
    return {
      id: row.id,
      groupName: row.group_name,
      sizes: row.sizes.map((size) => ({
        id: size.id,
        sizeName: size.size_name,
      })),
    };
  }

  static toResponseList(rows: SizeGroupRow[]): SizeGroupResponseDto[] {
    return rows.map((size) => this.toResponse(size));
  }
}
