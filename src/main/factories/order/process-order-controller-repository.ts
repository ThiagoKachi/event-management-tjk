import { DbProcessOrder } from '@data/usecases/order/process-order';
import { SendToQueueServiceAdapter } from '@infra/aws/queue/send-to-queue';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ChangeOrderStatusController } from '@presentation/controllers/order/process-order-controller';
import { Controller } from '@presentation/protocols';

export const makeProcessOrderController = (): Controller => {
  const PRODUCER_QUEUE_LAMBDA_URL = process.env.PRODUCER_QUEUE_LAMBDA_URL;
  const sendToQueueServiceAdapter = new SendToQueueServiceAdapter(PRODUCER_QUEUE_LAMBDA_URL!);

  const orderRepository = new OrderPrismaRepository();
  const changeOrderStatus = new DbProcessOrder(orderRepository, orderRepository, sendToQueueServiceAdapter);

  return new ChangeOrderStatusController(changeOrderStatus);
};
