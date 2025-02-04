import { DbProcessOrderPayment } from '@data/usecases/order/process-order-payment';
import { SendToQueueServiceAdapter } from '@infra/aws/queue/send-to-queue';
import { cacheAdapter } from '@infra/cache/redis-cache-adapter';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ProcessOrderPaymentController } from '@presentation/controllers/order/process-order-payment-controller';
import { Controller } from '@presentation/protocols';

export const makeProcessOrderPaymentController = (): Controller => {
  const cache = cacheAdapter;
  const PRODUCER_QUEUE_LAMBDA_URL = process.env.PRODUCER_QUEUE_LAMBDA_URL;
  const sendToQueueServiceAdapter = new SendToQueueServiceAdapter(PRODUCER_QUEUE_LAMBDA_URL!);

  const eventRepository = new EventPrismaRepository();
  const orderRepository = new OrderPrismaRepository();
  const changeOrderStatus = new DbProcessOrderPayment(
    orderRepository,
    orderRepository,
    sendToQueueServiceAdapter,
    eventRepository,
    cache
  );

  return new ProcessOrderPaymentController(changeOrderStatus);
};
