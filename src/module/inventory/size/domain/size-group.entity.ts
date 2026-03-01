import { Size } from './size.entity';

export class SizeGroup {
  constructor(
    public id: string,
    public groupName: string,
    public sizes: Size[],
  ) {}
}
