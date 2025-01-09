import { LoadEventsRepository } from '@data/protocols/db/event/load-events';
import { EventModel } from '@domain/models/event/event';
import { LoadEvents } from '@domain/usecases/event/load-events';

export class DbLoadEvents implements LoadEvents {
  constructor(private readonly loadEventsRepository: LoadEventsRepository) {}

  async load(name: string): Promise<EventModel[]> {
    return await this.loadEventsRepository.load(name);
  }
}
