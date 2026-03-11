export class ProductVariant {
  constructor(
    public sizeId: string | number,
    public quantityStock: number,
    public id?: string,
  ) {}

  static create(params: {
    sizeId: string | number;
    quantityStock: number;
  }): ProductVariant {
    return new ProductVariant(params.sizeId, params.quantityStock);
  }

  static createMany(
    params: {
      sizeId: string | number;
      quantityStock: number;
    }[],
  ): ProductVariant[] {
    return params.map((p) => ProductVariant.create(p));
  }
}
