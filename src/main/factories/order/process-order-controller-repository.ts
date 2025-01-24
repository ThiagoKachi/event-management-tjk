import { DbProcessOrder } from '@data/usecases/order/process-order';
import { QRCodeAdapter } from '@infra/QRCode/qrcode-adapter';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ProcessOrderController } from '@presentation/controllers/order/process-order-controller';
import { Controller } from '@presentation/protocols';

export const makeProcessOrderController = (orderId: string): Controller => {
  const orderRepository = new OrderPrismaRepository();
  const eventRepository = new EventPrismaRepository();
  const qrCodeAdapter = new QRCodeAdapter();

  const processOrder = new DbProcessOrder(
    orderRepository,
    eventRepository,
    qrCodeAdapter,
  );

  return new ProcessOrderController(processOrder, orderId);
};
