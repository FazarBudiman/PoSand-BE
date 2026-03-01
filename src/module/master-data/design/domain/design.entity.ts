export class Design {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly category: string,
    public readonly referenceImage: string,
    public readonly basePrice: number,
  ) {}
}
