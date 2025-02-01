import { BaseRepository } from "../../../utils/baseRepository";
import { ProductSku } from "../../../models/product_skus.model";
class ProductSkuRepository extends BaseRepository<ProductSku> {
  private static instance: ProductSkuRepository | null = null;

  private constructor() {
    super(ProductSku);
  }

  public static getInstance(): ProductSkuRepository {
    if (!ProductSkuRepository.instance) {
      ProductSkuRepository.instance = new ProductSkuRepository();
    }
    return ProductSkuRepository.instance;
  }

  // You can add specific methods for ProductSku repository if needed
}

export default ProductSkuRepository;
