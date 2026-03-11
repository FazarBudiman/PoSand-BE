import { ProductStockResponseDto } from '../dto/response/product-stock.response';
import { ProductStockRow } from '../repository/product-stock.row';

export class ProductStockMapper {
  static toResponse(productStock: ProductStockRow): ProductStockResponseDto {
    return {
      productId: productStock.product_id,
      productName: productStock.product_name,
      variantId: productStock.variant_id,
      sizeName: productStock.size_name,
      quantityStock: productStock.quantity_stock,
      stockHistory: productStock.stock_history,
    };
  }

  static toResponseList(
    productStocks: ProductStockRow[],
  ): ProductStockResponseDto[] {
    return productStocks.map((productStock) => this.toResponse(productStock));
  }
}
