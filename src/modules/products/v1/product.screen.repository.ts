import { BaseRepository } from "../../../utils/baseRepository";
import Screen from "../../../models/screen.model";
class ProductScreenRepository extends BaseRepository<Screen> {
  private static instance: ProductScreenRepository | null = null;

  private constructor() {
    super(Screen);
  }

  public static getInstance(): ProductScreenRepository {
    if (!ProductScreenRepository.instance) {
      ProductScreenRepository.instance = new ProductScreenRepository();
    }
    return ProductScreenRepository.instance;
  }

  // You can add specific methods for Screen repository if needed
}

export default ProductScreenRepository;
