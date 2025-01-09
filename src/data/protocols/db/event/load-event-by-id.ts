import { EventModel } from '@domain/models/event/event';

export interface LoadEventByIdRepository {
  loadById (id: string): Promise<EventModel | null>
}
