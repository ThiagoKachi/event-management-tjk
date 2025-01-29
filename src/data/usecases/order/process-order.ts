import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { SuccessOrderEmailSender } from '@data/protocols/email/order/success-order-email';
import { UploadImageRepository } from '@data/protocols/images/upload-image';
import { GenerateQRCodeImage } from '@data/protocols/QRCode/generate-image';
import { EventModel } from '@domain/models/event/event';
import { ProcessOrder } from '@domain/usecases/order/process-order';
import { NotFoundError } from '@presentation/errors/not-found-error';
import { PaymentRequiredError } from '@presentation/errors/payment-required-error';

export class DbProcessOrder implements ProcessOrder {
  constructor(
    private readonly loadOrderByIdRepository: LoadOrderByIdRepository,
    private readonly loadEventByIdRepository: LoadEventByIdRepository,
    private readonly updateAvailableTicketsRepository: UpdateAvailableTicketsRepository,
    private readonly generateQRCodeImage: GenerateQRCodeImage,
    private readonly uploadImageRepository: UploadImageRepository,
    private readonly successOrderEmailSender: SuccessOrderEmailSender,
  ) {}

  async process(orderId: string): Promise<void> {
    const order = await this.loadOrderByIdRepository.loadById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    if (order.status !== 'paid') {
      throw new PaymentRequiredError('The order must be paid to be processed.');
    }

    const event = await this.loadEventByIdRepository.loadById(order.eventId) as EventModel;

    const qrCodeImage = await this.generateQRCodeImage
      .generateImage(`${process.env.APPLICATION_URL}/${order.id}`);

    await this.uploadImageRepository
      .upload({ file: qrCodeImage, filename: `${order.id}.png` });

    await this.updateAvailableTicketsRepository
      .updateAvailableTickets({ id: order?.eventId, quantity: order?.quantity });

    await this.successOrderEmailSender.send({
      order_id: order.id,
      customer_email: order.customer_email,
      event_date: new Date(event.date).toLocaleDateString('pt-BR'),
      event_name: event.name,
      event_location: event.location,
      quantity: order.quantity,
      total_amount: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(order.quantity * event.price),
    });
  }
}

// Mudar "ticket_code" para "ticket_status" e quando ler o QRCode, mudar para "used"
// Separar em lambas menores (Processar a order, Gerar QRCode e Salvar no S3, Enviar email)
// Cache com Redis
// Gateway de pagamento
// Fazer ingressos nominais e gerar um QRCode por ingresso
