import { BaseRepository } from "../../../utils/baseRepository";
import Product from "../../../models/products.model";
class ProductREpository extends BaseRepository<Product> {
  private static instance: ProductREpository | null = null;

  private constructor() {
    super(Product);
  }

  public static getInstance(): ProductREpository {
    if (!ProductREpository.instance) {
      ProductREpository.instance = new ProductREpository();
    }
    return ProductREpository.instance;
  }

  // You can add specific methods for Product repository if needed
}

export default ProductREpository;
