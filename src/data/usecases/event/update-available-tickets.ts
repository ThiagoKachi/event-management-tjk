import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
import { UpdateAvailableTicketsModel } from '@domain/models/event/update-available-tickets';
import { UpdateAvailableTickets } from '@domain/usecases/event/update-available-tickets';
import { NotFoundError } from '@presentation/errors/not-found-error';

export class DbUpdateAvailableTickets implements UpdateAvailableTickets {
  constructor(
    private readonly loadEventByIdRepository: LoadEventByIdRepository,
    private readonly updateAvailableTicketsRepository: UpdateAvailableTicketsRepository,
  ) {}

  async updateAvailableTickets(data: UpdateAvailableTicketsModel): Promise<void> {
    const event = await this.loadEventByIdRepository.loadById(data.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    await this.updateAvailableTicketsRepository.updateAvailableTickets(data);
  }
}
