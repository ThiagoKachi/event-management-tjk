import { SaveCache } from '@data/protocols/cache';
import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { ChangeOrderStatusRepository } from '@data/protocols/db/order/change-order-status';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { SendToQueueRepository } from '@data/protocols/queue/order/send-order-to-queue';
import { ProcessOrderPayment } from '@domain/usecases/order/process-order-payment';
import { ConflictError } from '@presentation/errors/conflict-error';
import { NotFoundError } from '@presentation/errors/not-found-error';

export class DbProcessOrderPayment implements ProcessOrderPayment {
  constructor(
    private readonly changeOrderStatusRepository: ChangeOrderStatusRepository,
    private readonly loadOrderByIdRepository: LoadOrderByIdRepository,
    private readonly sendToQueueRepository: SendToQueueRepository,
    private readonly loadEventByIdRepository: LoadEventByIdRepository,
    private readonly saveCache: SaveCache,
  ) {}

  async orderInfo(orderId: string, status: string): Promise<void> {
    const order = await this.loadOrderByIdRepository.loadById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    if (order.status === 'paid') {
      throw new ConflictError('The order is already been paid.');
    }

    if (order.ticket_status === 'used') {
      throw new ConflictError('The order is already been used.');
    }

    try {
      await this.changeOrderStatusRepository.changeStatus(orderId, status);
      await this.sendToQueueRepository.send({ orderId });
    } catch (error) {
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
