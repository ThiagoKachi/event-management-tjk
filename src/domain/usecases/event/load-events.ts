import { EventModel } from '@domain/models/event/event';

export interface LoadEvents {
  load(name: string): Promise<EventModel[]>;
}
