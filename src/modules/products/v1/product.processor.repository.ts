import { BaseRepository } from "../../../utils/baseRepository";
import Processor from "../../../models/processor.model";
class ProductProcessorRepository extends BaseRepository<Processor> {
  private static instance: ProductProcessorRepository | null = null;

  private constructor() {
    super(Processor);
  }

  public static getInstance(): ProductProcessorRepository {
    if (!ProductProcessorRepository.instance) {
      ProductProcessorRepository.instance = new ProductProcessorRepository();
    }
    return ProductProcessorRepository.instance;
  }

  // You can add specific methods for Processor repository if needed
}

export default ProductProcessorRepository;
