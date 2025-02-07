import { BaseRepository } from "../../../utils/baseRepository";

import OrderItem from "../../../models/orderItem.model";
class OrderItemRepo extends BaseRepository<OrderItem> {
  private static instance: OrderItemRepo | null = null;

  private constructor() {
    super(OrderItem);
  }

  public static getInstance(): OrderItemRepo {
    if (!OrderItemRepo.instance) {
      OrderItemRepo.instance = new OrderItemRepo();
    }
    return OrderItemRepo.instance;
  }

  // You can add specific methods for Order repository if needed
}

export default OrderItemRepo;
