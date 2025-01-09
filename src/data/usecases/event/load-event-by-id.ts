import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { EventModel } from '@domain/models/event/event';
import { LoadEventById } from '@domain/usecases/event/load-event-by-id';

export class DbLoadEventById implements LoadEventById {
  constructor(private readonly loadEventsRepository: LoadEventByIdRepository) {}

  async loadById(id: string): Promise<EventModel | null> {
    return await this.loadEventsRepository.loadById(id);
  }
}
