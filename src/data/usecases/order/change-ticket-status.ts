import { ChangeTicketStatusRepository } from '@data/protocols/db/order/change-ticket-status';
import { ChangeTicketStatus } from '@domain/usecases/order/change-ticket-status';

export class DbChangeTicketStatus implements ChangeTicketStatus {
  constructor(
    private readonly changeTicketStatusRepository: ChangeTicketStatusRepository,
  ) {}

  async changeStatus(orderId: string): Promise<void> {
    await this.changeTicketStatusRepository.changeTicketStatus(orderId);
  }
}
