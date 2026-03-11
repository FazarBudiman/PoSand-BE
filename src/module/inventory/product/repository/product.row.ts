import { ProductVariantRow } from './product-variant.row';

export interface ProductRow {
  id: string;
  name: string;
  selling_price: number;
  reference_image_url: string;
  design_category: string;
  group_name: string;
  variants?: ProductVariantRow[];
}
