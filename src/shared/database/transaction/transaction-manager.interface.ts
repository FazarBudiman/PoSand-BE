export interface TransactionContext {
  readonly _brand: unique symbol;
}

export interface ITransactionManager {
  runInTransaction<T>(
    work: (context: TransactionContext) => Promise<T>,
  ): Promise<T>;
}
