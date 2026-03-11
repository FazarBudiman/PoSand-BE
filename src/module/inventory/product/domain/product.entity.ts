export class Product {
  constructor(
    public designId: string | number,
    public sizeGroupId: string | number,
    public name: string,
    public sellingPrice: number,
  ) {}

  static create(params: {
    designId: string | number;
    sizeGroupId: string | number;
    name: string;
    sellingPrice: number;
  }): Product {
    return new Product(
      params.designId,
      params.sizeGroupId,
      params.name,
      params.sellingPrice,
    );
  }

  static update(params: {
    name?: string;
    sellingPrice?: number;
  }): Partial<Product> {
    return params;
  }
}
