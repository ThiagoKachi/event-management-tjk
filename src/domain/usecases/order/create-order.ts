import { CreateOrderModel } from '@domain/models/order/create-order';
import { OrderModel } from '@domain/models/order/order';

export interface CreateOrder {
  create(orderBody: CreateOrderModel): Promise<OrderModel>;
}
