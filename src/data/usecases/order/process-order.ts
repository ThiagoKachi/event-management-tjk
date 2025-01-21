import { ChangeOrderStatusRepository } from '@data/protocols/db/order/change-order-status';
import { ProcessOrder } from '@domain/usecases/order/change-order-status';

export class DbProcessOrder implements ProcessOrder {
  constructor(
    private readonly changeOrderStatusRepository: ChangeOrderStatusRepository,
  ) {}

  async processOrder(orderId: string, status: string): Promise<void> {
    await this.changeOrderStatusRepository.changeStatus(orderId, status);

    // Envia para a fila com o ID do pedido
  }
}
