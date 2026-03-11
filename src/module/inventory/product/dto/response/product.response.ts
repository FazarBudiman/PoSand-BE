export class StockInfoResponse {
  sizeId: string;
  sizeName: string;
  quantity: number;
}

export class ProductResponseDto {
  id: string;
  designReferenceImageUrl: string;
  designCategory: string;
  sizeGroupName: string;
  name: string;
  sellingPrice: number;
  stock?: StockInfoResponse[];
}
