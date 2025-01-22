import { OrderModel } from '@domain/models/order/order';

export interface LoadOrderByIdRepository {
  loadById(orderId: string): Promise<OrderModel | null>
}
