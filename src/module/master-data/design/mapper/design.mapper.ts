import { DesignResponseDto } from '../dto/response/design.response.dto';
import { DesignRow } from '../repository/design.row';

export class DesignMapper {
  static toResponse(design: DesignRow): DesignResponseDto {
    return {
      id: design.id,
      name: design.design_name,
      description: design.design_description,
      category: design.design_category,
      referenceImage: design.reference_image_url,
      basePrice: design.base_price_estimation,
    };
  }

  static toResponseList(designs: DesignRow[]): DesignResponseDto[] {
    return designs.map((design) => this.toResponse(design));
  }
}
