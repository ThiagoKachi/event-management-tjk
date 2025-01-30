import { DbChangeTicketStatus } from '@data/usecases/order/change-ticket-status';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ChangeTicketStatusController } from '@presentation/controllers/order/change-ticket-status-controller';
import { Controller } from '@presentation/protocols';

export const makeChangeTicketStatusController = (): Controller => {
  const orderRepository = new OrderPrismaRepository();
  const createOrder = new DbChangeTicketStatus(orderRepository);

  return new ChangeTicketStatusController(createOrder);
};
