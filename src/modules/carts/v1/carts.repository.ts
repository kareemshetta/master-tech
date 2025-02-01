import { BaseRepository } from "../../../utils/baseRepository";
import Cart from "../../../models/carts.model";
class CartRepo extends BaseRepository<Cart> {
  private static instance: CartRepo | null = null;

  private constructor() {
    super(Cart);
  }

  public static getInstance(): CartRepo {
    if (!CartRepo.instance) {
      CartRepo.instance = new CartRepo();
    }
    return CartRepo.instance;
  }

  // You can add specific methods for Cart repository if needed
}

export default CartRepo;
