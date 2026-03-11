export class Design {
  constructor(
    public readonly name: string,
    public readonly referenceImageUrl: string,
    public readonly basePrice: number,
    public readonly description?: string | null,
    public readonly category?: string | null,
  ) {}

  static create(params: {
    name: string;
    referenceImageUrl: string;
    basePrice: number;
    description?: string | null;
    category?: string | null;
  }): Design {
    return new Design(
      params.name,
      params.referenceImageUrl,
      Number(params.basePrice),
      params.description ?? null,
      params.category ?? null,
    );
  }

  static update(params: {
    name?: string;
    referenceImageUrl?: string;
    basePrice?: number;
    description?: string | null;
    category?: string | null;
  }): Partial<Design> {
    return params;
  }
}
