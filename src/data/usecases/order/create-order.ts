import { RecoverCache, SaveCache } from '@data/protocols/cache';
import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { CreateOrderRepository } from '@data/protocols/db/order/create-order';
import { EmailSender } from '@data/protocols/email/order/confirmation-order-email';
import { CreateOrderModel } from '@domain/models/order/create-order';
import { OrderModel } from '@domain/models/order/order';
import { CreateOrder } from '@domain/usecases/order/create-order';
import { ConflictError } from '@presentation/errors/conflict-error';
import { NotFoundError } from '@presentation/errors/not-found-error';

export class DbCreateOrder implements CreateOrder {
  constructor(
    private readonly loadEventByIdRepository: LoadEventByIdRepository,
    private readonly createOrderRepository: CreateOrderRepository,
    private readonly emailSender: EmailSender,
    private readonly saveCache: SaveCache,
    private readonly recoverCache: RecoverCache,
  ) {}

  async create(orderBody: CreateOrderModel): Promise<OrderModel> {
    const event = await this.loadEventByIdRepository.loadById(orderBody.eventId);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    let availableTickets = await this.recoverCache
      .recover(`available_tickets:${event.id}`) as number;

    if (!availableTickets) {
      availableTickets = event.available;
      await this.saveCache
        .save(`available_tickets:${event.id}`, event.available, 900);
    }

    if (availableTickets < orderBody.quantity) {
      throw new ConflictError(`Only ${availableTickets} tickets available`);
    }

    const totalAmount = event.price * orderBody.quantity;

    const order = await this.createOrderRepository.create(orderBody, totalAmount);

    await this.saveCache
      .save(`available_tickets:${event.id}`, availableTickets - orderBody.quantity, 900);

    await this.emailSender.send({
      orderId: order.id,
      customer_email: order.customer_email,
      event_date: new Date(event.date).toLocaleDateString('pt-BR'),
      event_name: event.name,
      quantity: order.quantity,
      total_amount: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(order.quantity * event.price)
    });

    return order;
  }
}
