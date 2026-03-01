import { Product } from '../domain/product.entity';
import { ProductResponseDto } from '../dto/response/product.response';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      designReferenceImageUrl: product.designReferenceImageUrl,
      designCategory: product.designCategory,
      sizeGroupName: product.sizeGroupName,
      name: product.name,
      sellingPrice: product.sellingPrice,
      stock: product.variants?.map((v) => ({
        sizeId: v.sizeId!,
        sizeName: v.sizeName!,
        quantity: v.quantityStock!,
      })),
    };
  }

  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
