import { CreateOrderRepository } from '@data/protocols/db/order/create-order';
import { CreateOrderModel } from '@domain/models/order/create-order';
import { OrderModel } from '@domain/models/order/order';
import { prismaClient } from '../prismaClient';

export class OrderPrismaRepository implements CreateOrderRepository {
  async create(orderData: CreateOrderModel, total: number): Promise<OrderModel> {
    const order = await prismaClient.order.create({
      data: {
        ...orderData,
        status: 'pending',
        ticket_code: '',
        total_amount: total,
      },
    });

    return { ...order, created_at: order.created_at.toISOString() };
  }
}
