---
description: Coding conventions and patterns for PoSand backend modules
---

# PoSand Backend — Coding Conventions

## 1. Module Structure

Every module follows this folder structure:

```
module/
  └── <module-name>/
      ├── controller/       # HTTP layer (routing, decorators, response wrapping)
      ├── service/           # Business logic (validation, orchestration)
      ├── repository/        # Data access (SQL queries, mapping to entity)
      ├── domain/
      │   ├── interface/     # Repository interfaces + DI tokens
      │   └── *.entity.ts    # Domain entities (classes)
      ├── dto/
      │   ├── request/       # Incoming request DTOs (validated with class-validator)
      │   └── response/      # Outgoing response DTOs
      ├── mapper/            # Entity ↔ ResponseDTO mapping (static methods)
      └── <module-name>.module.ts
```

## 2. Naming Conventions

### Repository Methods

| Operation         | Pattern                         | Example                              |
| :---------------- | :------------------------------ | :----------------------------------- |
| Get all           | `findAll<Resources>()`          | `findAllProducts()`                  |
| Get by ID         | `find<Resource>ById(id)`        | `findProductById(id)`                |
| Existence by ID   | `exists<Resource>ById(id)`      | `existsProductById(id)`              |
| Existence by name | `exists<Resource>ByName(name)`  | `existsDesignByName(name)`           |
| Create            | `create<Resource>(dto, userId)` | `createProduct(dto, userId)`         |
| Update            | `update<Resource>ById(id, ...)` | `updateProductById(id, dto, userId)` |
| Delete (soft)     | `delete<Resource>ById(id)`      | `deleteProductById(id)`              |

> **Rule**: Selalu sertakan nama resource dalam nama method agar tetap jelas saat repository digunakan lintas service.

### Service Methods

Sama persis dengan repository, kecuali jika ada logika bisnis tambahan yang memerlukan nama lebih deskriptif.

### Controller Methods

Ikuti nama service method yang dipanggil:

- `findAllProducts()`, `findProductById()`, `createProduct()`, `updateProduct()`, `deleteProduct()`

### Parameter Types

- Gunakan `string` langsung untuk `id` dan `name` — **bukan** `Pick<Entity, 'field'>` atau DTO wrapper.
- Gunakan `string` untuk ID — **bukan** `string | bigint`.

## 3. Separation of Concerns

### Controller

- ❌ Tidak boleh mengandung logika bisnis
- ✅ Hanya: parse params/body → panggil service → wrap response dengan mapper
- ✅ Untuk endpoint DELETE, tidak perlu mengembalikan field `data`, cukup `message` (dan status HTTP).
- ✅ Melakukan translasi format (berkomunikasi dengan dunia luar melalui DTO).

### Service

- ✅ Validasi bisnis (exists check, conflict check, stock guard, dll.)
- ✅ Throw custom exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`)
- ✅ Orchestrate multiple repository calls
- ✅ Manage transactions via `PgTransactionManager`
- ✅ Meneruskan apa yang dikembalikan oleh Repository ke Controller.
- ❌ Tidak boleh menjalankan SQL query

### Repository

- ✅ SQL queries + mapping.
- ✅ Mengembalikan _raw_ Row untuk **semua** operasi read/create/update sesuai aliran: Query DB -> Row -> Response DTO.
- ✅ Return `undefined` jika data tidak ditemukan (bukan throw error)
- ❌ Tidak boleh throw business exceptions
- ❌ **TIDAK BOLEH** tahu tentang format `ResponseDTO` eksternal maupun internal Entity jika output. Mapping respons DB ke eksternal adalah tugas Controller/Mapper.

### Mapper

- ✅ Static class dengan `toResponse(entity)` dan `toResponseList(entities)`
- ❌ Tidak boleh mengandung logika bisnis

## 4. Error Handling

| Layer      | Responsibility                                                        |
| :--------- | :-------------------------------------------------------------------- |
| Repository | Return `undefined` / `false`                                          |
| Service    | Throw `NotFoundException`, `ConflictException`, `BadRequestException` |
| Controller | Let exceptions propagate to global filter                             |

```typescript
// ✅ Correct (Repository)
async findProductById(id: string): Promise<Product | undefined> {
  // ...
  if (!rows.length) return undefined;
  return mapToEntity(rows[0]);
}

// ✅ Correct (Service)
async findProductById(id: string): Promise<Product> {
  const product = await this.productRepository.findProductById(id);
  if (!product) {
    throw new NotFoundException('Product not found', 'RESOURCE_NOT_FOUND');
  }
  return product;
}
```

## 5. Transaction Management

- **Selalu** gunakan `PgTransactionManager.runInTransaction()`.
- **Jangan** gunakan manual `pool.connect()` + `BEGIN/COMMIT/ROLLBACK`.
- Repository methods yang perlu support transaction harus menerima `txContext?: PgTransactionContext` sebagai parameter terakhir.

```typescript
// Service
return this.transactionManager.runInTransaction(async (tx) => {
  const variants = await this.variantRepo.createProductVariants(
    productId,
    dto,
    userId,
    tx as PgTransactionContext,
  );
  await this.stockRepo.insertStockMovements(
    variants,
    'PRODUCT',
    productId,
    userId,
    tx as PgTransactionContext,
  );
  return this.productRepo.findProductById(productId);
});
```

## 6. Repository Split Rules

Satu repository = satu tabel utama. Jika satu module mengelola banyak tabel (misalnya `products`, `product_variants`, `stock_movements`), pecah menjadi repository terpisah:

| Table              | Repository                 |
| :----------------- | :------------------------- |
| `products`         | `ProductRepository`        |
| `product_variants` | `ProductVariantRepository` |
| `stock_movements`  | `StockMovementRepository`  |

> Exception: Jika tabel child hanya di-read sebagai bagian dari JOIN (bukan dimanipulasi langsung), boleh tetap di repository parent.

## 7. Interface & DI Token

```typescript
// Symbol token
export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

// Interface
export interface IProductRepository {
  findAllProducts(): Promise<Product[]>;
  findProductById(id: string): Promise<Product | undefined>;
  // ...
}
```

Module wiring:

```typescript
{
  provide: PRODUCT_REPOSITORY,
  useClass: ProductRepository,
}
```

## 8. Checklist untuk Module Baru

- [ ] Buat entity di `domain/`
- [ ] Buat interface repository di `domain/interface/` dengan DI Symbol token
- [ ] Buat repository implementation di `repository/`
- [ ] Buat request DTOs di `dto/request/`
- [ ] Buat response DTOs di `dto/response/`
- [ ] Buat mapper di `mapper/`
- [ ] Buat service di `service/`
- [ ] Buat controller di `controller/`
- [ ] Wire semua di `<module-name>.module.ts`
- [ ] Pastikan naming konsisten sesuai konvensi di atas
