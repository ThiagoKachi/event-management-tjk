import { SaveCache } from '@data/protocols/cache/save-cache';
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
  ) {}

  async create(orderBody: CreateOrderModel): Promise<OrderModel> {
    const event = await this.loadEventByIdRepository.loadById(orderBody.eventId);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (event.available < orderBody.quantity) {
      throw new ConflictError(`Only ${event.available} tickets available`);
    }

    const totalAmount = event.price * orderBody.quantity;

    const order = await this.createOrderRepository.create(orderBody, totalAmount);

    // Fazer a consulta de quantidade pelo Redis
    // Decrementar a quantidade de ingressos disponíveis pelo REDIS (Temporário)
    // Quando criar o event, coloca a quantidade de ingressos disponíveis no REDIS

    await this.saveCache.save(`available_tickets:${event.id}`, event.available - orderBody.quantity);

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
