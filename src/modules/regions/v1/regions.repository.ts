import { BaseRepository } from "../../../utils/baseRepository";
import Region from "../../../models/regions.model";

class RegionRepository extends BaseRepository<Region> {
  private static instance: RegionRepository | null = null;

  private constructor() {
    super(Region);
  }

  public static getInstance(): RegionRepository {
    if (!RegionRepository.instance) {
      RegionRepository.instance = new RegionRepository();
    }
    return RegionRepository.instance;
  }

  // You can add specific methods for Region repository if needed
}

export default RegionRepository;
