import { BaseRepository } from "../../../utils/baseRepository";
import Home from "../../../models/home.model";

class HomeRepository extends BaseRepository<Home> {
  private static instance: HomeRepository | null = null;

  private constructor() {
    super(Home);
  }

  public static getInstance(): HomeRepository {
    if (!HomeRepository.instance) {
      HomeRepository.instance = new HomeRepository();
    }
    return HomeRepository.instance;
  }

  // You can add specific methods for Home repository if needed
}

export default HomeRepository;
