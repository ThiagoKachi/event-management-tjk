import { ChangeOrderStatusRepository } from '@data/protocols/db/order/change-order-status';
import { ChangeTicketStatusRepository } from '@data/protocols/db/order/change-ticket-status';
import { CreateOrderRepository } from '@data/protocols/db/order/create-order';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { CreateOrderModel } from '@domain/models/order/create-order';
import { OrderModel } from '@domain/models/order/order';
import { prismaClient } from '../prismaClient';

export class OrderPrismaRepository implements CreateOrderRepository, ChangeOrderStatusRepository, LoadOrderByIdRepository, ChangeTicketStatusRepository {
  async changeTicketStatus(orderId: string): Promise<void> {
    await prismaClient.order
      .update({ where: { id: orderId }, data: { ticket_status: 'used' } });
  }

  async loadById(orderId: string): Promise<OrderModel | null> {
    const order = await prismaClient.order.findFirst({ where: { id: orderId } });

    return order && { ...order, created_at: order.created_at.toISOString() };
  }

  async changeStatus(orderId: string, status: string): Promise<void> {
    await prismaClient.order.update({ where: { id: orderId }, data: { status } });
  }

  async create(orderData: CreateOrderModel, total: number): Promise<OrderModel> {
    const order = await prismaClient.order.create({
      data: {
        ...orderData,
        status: 'pending',
        ticket_status: 'available',
        total_amount: total,
      },
    });

    return { ...order, created_at: order.created_at.toISOString() };
  }
}
