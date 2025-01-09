import { CreateEventRepository } from '@data/protocols/db/event/create-event';
import { EventModel } from '@domain/models/event/event';
import { CreateEvent } from '@domain/usecases/event/create-event';

export class DbCreateEvent implements CreateEvent {
  constructor(private readonly createEventRepository: CreateEventRepository) {}

  async create(eventBody: EventModel): Promise<EventModel> {
    return await this.createEventRepository.create(eventBody);
  }
}
