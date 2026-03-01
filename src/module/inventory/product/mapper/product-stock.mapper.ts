import { ProductStock } from '../domain/product-stock.entity';
import { ProductStockResponseDto } from '../dto/response/product-stock.response';

export class ProductStockMapper {
  static toResponse(productStock: ProductStock): ProductStockResponseDto {
    return {
      productId: productStock.productId,
      productName: productStock.productName,
      variantId: productStock.variantId,
      sizeName: productStock.sizeName,
      quantityStock: productStock.quantityStock,
      stockHistory: productStock.stockHistory,
    };
  }

  static toResponseList(
    productStocks: ProductStock[],
  ): ProductStockResponseDto[] {
    return productStocks.map((productStock) => this.toResponse(productStock));
  }
}
