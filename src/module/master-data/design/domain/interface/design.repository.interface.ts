import { DesignRow } from '../../repository/design.row';
import { Design } from '../design.entity';

export const DESIGN_REPOSITORY = Symbol('DESIGN_REPOSITORY');

export interface IDesignRepository {
  findAllDesigns(): Promise<DesignRow[]>;
  existsDesignByName(name: string): Promise<boolean>;
  createDesign(design: Design, createdBy: string): Promise<DesignRow>;
  findDesignById(id: string): Promise<DesignRow | undefined>;
  updateDesignById(
    id: string,
    design: Partial<Design>,
    updatedBy: string,
  ): Promise<DesignRow | undefined>;
  deleteDesignById(id: string): Promise<boolean>;
}
