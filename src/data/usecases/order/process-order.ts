import { ChangeOrderStatusRepository } from '@data/protocols/db/order/change-order-status';
import { ProcessOrder } from '@domain/usecases/order/process-order';

export class DbProcessOrder implements ProcessOrder {
  constructor(
    private readonly changeOrderStatusRepository: ChangeOrderStatusRepository,
  ) {}

  async orderInfo(orderId: string, status: string): Promise<void> {
    await this.changeOrderStatusRepository.changeStatus(orderId, status);

    // Envia para a fila com o ID do pedido
  }
}
