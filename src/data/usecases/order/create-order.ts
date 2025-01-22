import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
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
    private readonly updateAvailableTicketsRepository: UpdateAvailableTicketsRepository,
    private readonly createOrderRepository: CreateOrderRepository,
    private readonly emailSender: EmailSender,
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

    // Decrementar a quantidade de ingressos disponíveis (Temporário)
    await this.updateAvailableTicketsRepository
      .updateAvailableTickets({ id: orderBody.eventId, quantity: orderBody.quantity });

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

    // Gera o QRCode e salva no S3
    // Atualiza 'ticket_code' com o código
    // Confirma a venda e decrementa no banco
    // Envia email para o cliente com os dados do pedido e QRCode
    // Redis e Gateway de pagamento

    return order;
  }
}
