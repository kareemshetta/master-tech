import { BaseRepository } from "../../../utils/baseRepository";
import City from "../../../models/cities.model";

class CityRepository extends BaseRepository<City> {
  private static instance: CityRepository | null = null;

  private constructor() {
    super(City);
  }

  public static getInstance(): CityRepository {
    if (!CityRepository.instance) {
      CityRepository.instance = new CityRepository();
    }
    return CityRepository.instance;
  }

  // You can add specific methods for City repository if needed
}

export default CityRepository;
