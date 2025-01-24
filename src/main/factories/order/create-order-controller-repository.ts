import { DbCreateOrder } from '@data/usecases/order/create-order';
import { ExternalEmailServiceAdapter } from '@infra/aws/email/send-email';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { CreateOrderValidatorAdapter } from '@infra/validation/order/create-order-validation-adapter';
import { CreateOrderController } from '@presentation/controllers/order/create-order-controller';
import { Controller } from '@presentation/protocols';

export const makeCreateOrderController = (): Controller => {
  const EMAIL_URL = process.env.EMAIL_LAMBDA_URL;
  const eventRepository = new EventPrismaRepository();
  const orderRepository = new OrderPrismaRepository();
  const emailServiceAdapter = new ExternalEmailServiceAdapter(EMAIL_URL!);
  const createOrder = new DbCreateOrder(
    eventRepository,
    orderRepository,
    emailServiceAdapter
  );

  const validator = new CreateOrderValidatorAdapter();

  return new CreateOrderController(createOrder, validator);
};
