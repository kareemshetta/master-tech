import { BaseRepository } from "../../../utils/baseRepository";
import Category from "../../../models/categories.model";
class CategoryRepository extends BaseRepository<Category> {
  private static instance: CategoryRepository | null = null;

  private constructor() {
    super(Category);
  }

  public static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  // You can add specific methods for Category repository if needed
}

export default CategoryRepository;
