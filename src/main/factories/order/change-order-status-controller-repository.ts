import { DbProcessOrder } from '@data/usecases/order/process-order';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ChangeOrderStatusController } from '@presentation/controllers/order/change-order-status-controller';
import { Controller } from '@presentation/protocols';

export const makeChangeOrderStatusController = (): Controller => {
  const orderRepository = new OrderPrismaRepository();
  const changeOrderStatus = new DbProcessOrder(orderRepository);

  return new ChangeOrderStatusController(changeOrderStatus);
};
