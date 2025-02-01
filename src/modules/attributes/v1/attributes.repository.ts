import { BaseRepository } from "../../../utils/baseRepository";
import ProductAttribute from "../../../models/product_attributes.model";
class ProductAttributesRepository extends BaseRepository<ProductAttribute> {
  private static instance: ProductAttributesRepository | null = null;

  private constructor() {
    super(ProductAttribute);
  }

  public static getInstance(): ProductAttributesRepository {
    if (!ProductAttributesRepository.instance) {
      ProductAttributesRepository.instance = new ProductAttributesRepository();
    }
    return ProductAttributesRepository.instance;
  }

  // You can add specific methods for ProductAttribute repository if needed
}

export default ProductAttributesRepository;
