import { ChangeOrderStatusRepository } from '@data/protocols/db/order/change-order-status';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { SendToQueueRepository } from '@data/protocols/queue/order/send-order-to-queue';
import { ProcessOrder } from '@domain/usecases/order/process-order';
import { ConflictError } from '@presentation/errors/conflict-error';

export class DbProcessOrder implements ProcessOrder {
  constructor(
    private readonly changeOrderStatusRepository: ChangeOrderStatusRepository,
    private readonly loadOrderByIdRepository: LoadOrderByIdRepository,
    private readonly sendToQueueRepository: SendToQueueRepository,
  ) {}

  async orderInfo(orderId: string, status: string): Promise<void> {
    const order = await this.loadOrderByIdRepository.loadById(orderId);

    if (order && order.status === 'paid') {
      throw new ConflictError('The order is already been paid.');
    }

    await this.changeOrderStatusRepository.changeStatus(orderId, status);

    await this.sendToQueueRepository.send({ orderId });
  }
}
