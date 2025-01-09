import { CreateEventRepository } from '@data/protocols/db/event/create-event';
import { LoadEventsRepository } from '@data/protocols/db/event/load-events';
import { EventModel } from '@domain/models/event/event';
import { CreateEvent } from '@domain/usecases/event/create-event';
import { ConflictError } from '@presentation/errors/conflict-error';

export class DbCreateEvent implements CreateEvent {
  constructor(
    private readonly createEventRepository: CreateEventRepository,
    private readonly loadEventsRepository: LoadEventsRepository,
  ) {}

  async create(eventBody: EventModel): Promise<EventModel> {
    const event = await this.loadEventsRepository.load(eventBody.name);

    if (event.length) {
      throw new ConflictError('Event with the same name already exists');
    }

    return await this.createEventRepository.create(eventBody);
  }
}
