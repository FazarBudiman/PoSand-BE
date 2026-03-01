import { ProductVariant } from './product-variant.entity';

export class Product {
  constructor(
    public id: string,
    public designReferenceImageUrl: string,
    public designCategory: string,
    public sizeGroupName: string,
    public name: string,
    public sellingPrice: number,
    public variants: ProductVariant[] = [],
  ) {}
}
