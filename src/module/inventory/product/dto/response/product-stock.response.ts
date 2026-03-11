export class ProductStockResponseDto {
  productId: string;
  productName: string;
  variantId: string;
  sizeName: string;
  quantityStock: number;
  stockHistory: [];
}
