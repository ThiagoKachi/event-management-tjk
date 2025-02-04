import { SaveCache } from '@data/protocols/cache';
import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { ErrorFeedbackEmailSender } from '@data/protocols/email/order/error-feedback-order-email';
import { SuccessOrderEmailSender } from '@data/protocols/email/order/success-order-email';
import { UploadImageRepository } from '@data/protocols/images/upload-image';
import { GenerateQRCodeImage } from '@data/protocols/QRCode/generate-image';
import { EventModel } from '@domain/models/event/event';
import { ProcessOrder } from '@domain/usecases/order/process-order';
import { ServerError } from '@presentation/errors';
import { ConflictError } from '@presentation/errors/conflict-error';
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
    private readonly saveCache: SaveCache,
    private readonly errorFeedbackEmailSender: ErrorFeedbackEmailSender,
  ) {}

  async process(orderId: string): Promise<void> {
    if (!process.env.APPLICATION_URL) {
      throw new ServerError('APPLICATION_URL environment variable is required');
    }

    const order = await this.loadOrderByIdRepository.loadById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    if (order.status !== 'paid') {
      throw new PaymentRequiredError('The order must be paid to be processed.');
    }

    if (order.ticket_status === 'used') {
      throw new ConflictError('The order is already been used.');
    }

    const event = await this.loadEventByIdRepository.loadById(order.eventId) as EventModel;

    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    try {
      const qrCodeImage = await this.generateQRCodeImage
        .generateImage(`${process.env.APPLICATION_URL}/${order.id}`);

      await this.uploadImageRepository
        .upload({ file: qrCodeImage, filename: `${order.id}.png` });

      await Promise.all([
        this.updateAvailableTicketsRepository
          .updateAvailableTickets({ id: order?.eventId, quantity: order?.quantity }),

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
        })
      ]);
    } catch (error) {
      await this.errorFeedbackEmailSender.send({
        orderId: order.id,
        customer_email: order.customer_email,
      });

      const event = await this.loadEventByIdRepository.loadById(order.eventId);

      if (!event) {
        throw new NotFoundError('Event not found.');
      }

      await this.saveCache
        .save(`available_tickets:${event.id}`, event.available, 900);

      throw error;
    }
  }
}
