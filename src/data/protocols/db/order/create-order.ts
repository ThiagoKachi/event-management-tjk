import { CreateOrderModel } from '@domain/models/order/create-order';
import { OrderModel } from '@domain/models/order/order';

export interface CreateOrderRepository {
  create (orderData: CreateOrderModel, total: number): Promise<OrderModel>
}
