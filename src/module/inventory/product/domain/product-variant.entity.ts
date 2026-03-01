export class ProductVariant {
  public id?: string;
  public productId?: string;
  public sizeId?: string;
  public quantityStock?: number;
  public sizeName?: string;

  constructor(partial?: Partial<ProductVariant>) {
    Object.assign(this, partial);
  }
}
