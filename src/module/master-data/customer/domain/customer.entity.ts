export class Customer {
  constructor(
    public readonly fullname?: string,
    public readonly phone?: string | null,
    public readonly address?: string | null,
    public readonly tags?: string[],
  ) {}

  static create(params: {
    fullname: string;
    phone?: string | null;
    address?: string | null;
    tags?: string[];
  }): Customer {
    return new Customer(
      params.fullname,
      params.phone ?? null,
      params.address ?? null,
      params.tags ?? [],
    );
  }

  static update(params: {
    fullname?: string;
    phone?: string;
    address?: string;
    tags?: string[];
  }): Customer {
    return params;
  }
}
