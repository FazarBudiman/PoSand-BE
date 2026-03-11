import { ProductStockRow } from '../../repository/product-stock.row';

export const PRODUCT_STOCK_REPOSITORY = Symbol('IProductStockRepository');

export interface IProductStockRepository {
  findStockHistoryByProductId(id: string): Promise<ProductStockRow[]>;
}
