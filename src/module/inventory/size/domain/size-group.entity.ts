export class SizeGroup {
  constructor(
    public groupName: string,
    public sizes: string[],
  ) {}

  static create(params: { groupName: string; sizes: string[] }): SizeGroup {
    return new SizeGroup(params.groupName, params.sizes);
  }
}
