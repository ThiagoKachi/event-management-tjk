import { DbCreateOrder } from '@data/usecases/order/create-order';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { CreateOrderValidatorAdapter } from '@infra/validation/order/create-order-validation-adapter';
import { CreateOrderController } from '@presentation/controllers/order/create-order-controller';
import { Controller } from '@presentation/protocols';

export const makeCreateOrderController = (): Controller => {
  const eventRepository = new EventPrismaRepository();
  const orderRepository = new OrderPrismaRepository();
  const createOrder = new DbCreateOrder(eventRepository, eventRepository, orderRepository);

  const validator = new CreateOrderValidatorAdapter();

  return new CreateOrderController(createOrder, validator);
};
