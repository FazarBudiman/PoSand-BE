import { ProductResponseDto } from '../dto/response/product.response';
import { ProductRow } from '../repository/product.row';

export class ProductMapper {
  static toResponse(product: ProductRow): ProductResponseDto {
    return {
      id: product.id,
      designReferenceImageUrl: product.reference_image_url,
      designCategory: product.design_category,
      sizeGroupName: product.group_name,
      name: product.name,
      sellingPrice: product.selling_price,
      stock: product.variants?.map((v) => ({
        variantId: v.variant_id,
        sizeId: v.size_id,
        sizeName: v.size_name,
        quantity: v.quantity_stock,
      })),
    };
  }

  static toResponseList(products: ProductRow[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
