import { BaseRepository } from "../../../utils/baseRepository";
import CartItem from "../../../models/cartItem.model";
class CartItemRepo extends BaseRepository<CartItem> {
  private static instance: CartItemRepo | null = null;

  private constructor() {
    super(CartItem);
  }

  public static getInstance(): CartItemRepo {
    if (!CartItemRepo.instance) {
      CartItemRepo.instance = new CartItemRepo();
    }
    return CartItemRepo.instance;
  }

  // You can add specific methods for CartItem repository if needed
}

export default CartItemRepo;
