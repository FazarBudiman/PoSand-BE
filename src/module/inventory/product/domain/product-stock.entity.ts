export class ProductStock {
  constructor(
    public productId: string,
    public productName: string,
    public variantId: string,
    public sizeName: string,
    public quantityStock: number,
    public stockHistory: [],
  ) {}
}
