export interface ProductStockRow {
  product_id: string;
  product_name: string;
  variant_id: string;
  size_name: string;
  quantity_stock: number;
  stock_history: [];
}
