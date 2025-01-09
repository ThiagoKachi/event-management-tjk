import { EventModel } from '@domain/models/event/event';

export interface LoadEventById {
  loadById(id: string): Promise<EventModel | null>;
}
