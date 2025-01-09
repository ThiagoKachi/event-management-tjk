import { EventModel } from '@domain/models/event/event';

export interface LoadEventsRepository {
  load (name: string): Promise<EventModel[]>
}
