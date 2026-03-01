import { ProductStock } from '../product-stock.entity';

export const PRODUCT_STOCK_REPOSITORY = Symbol('IProductStockRepository');

export interface IProductStockRepository {
  getHistoryStockProductById(id: string): Promise<ProductStock[]>;
}
