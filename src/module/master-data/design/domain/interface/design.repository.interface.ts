import { Design } from '../design.entity';

export const DESIGN_REPOSITORY = 'DESIGN_REPOSITORY';

export interface IDesignRepository {
  getAllDesign(): Promise<Design[]>;
  isDesignExist(design: Pick<Design, 'name'>): Promise<boolean>;
  createDesign(design: Omit<Design, 'id'>, userId: string): Promise<Design>;
  getDesignById(id: string | bigint): Promise<Design | undefined>;
  updateDesignById(
    id: string | bigint,
    design: Partial<Omit<Design, 'id'>>,
    userId: string,
  ): Promise<Design | undefined>;
  deleteDesignById(id: string | bigint): Promise<boolean>;
}
