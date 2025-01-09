import { EventModel } from '@domain/models/event/event';

export interface CreateEvent {
  create(eventBody: EventModel): Promise<EventModel>;
}
