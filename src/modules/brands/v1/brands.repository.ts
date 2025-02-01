import { BaseRepository } from "../../../utils/baseRepository";
import Brand from "../../../models/brands.model";
export class BrandRepository extends BaseRepository<Brand> {
  private static instance: BrandRepository | null = null;

  private constructor() {
    super(Brand);
  }

  public static getInstance(): BrandRepository {
    if (!BrandRepository.instance) {
      BrandRepository.instance = new BrandRepository();
    }
    return BrandRepository.instance;
  }

  // You can add specific methods for Brand repository if needed
}
