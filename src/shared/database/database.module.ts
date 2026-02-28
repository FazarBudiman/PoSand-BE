import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './tokens/pg.token';
import { TRANSACTION_MANAGER } from './tokens/transaction.token';
import { PgTransactionManager } from './transaction/pg-transaction.manager';

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL!,
        });
      },
    },
    {
      provide: TRANSACTION_MANAGER,
      useClass: PgTransactionManager,
    },
  ],
  exports: [PG_POOL, TRANSACTION_MANAGER],
})
export class DatabaseModule {}
