import { Design } from '../domain/design.entity';
import { DesignResponseDto } from '../dto/response/design.response.dto';

export class DesignMapper {
  static toResponse(design: Design): DesignResponseDto {
    return {
      id: design.id,
      name: design.name,
      description: design.description,
      category: design.category,
      referenceImage: design.referenceImage,
      basePrice: design.basePrice,
    };
  }

  static toResponseList(designs: Design[]): DesignResponseDto[] {
    return designs.map((design) => this.toResponse(design));
  }
}
