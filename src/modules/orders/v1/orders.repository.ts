import { BaseRepository } from "../../../utils/baseRepository";
import Order from "../../../models/orders.model";
class OrderRepo extends BaseRepository<Order> {
  private static instance: OrderRepo | null = null;

  private constructor() {
    super(Order);
  }

  public static getInstance(): OrderRepo {
    if (!OrderRepo.instance) {
      OrderRepo.instance = new OrderRepo();
    }
    return OrderRepo.instance;
  }

  // You can add specific methods for Order repository if needed
}

export default OrderRepo;
