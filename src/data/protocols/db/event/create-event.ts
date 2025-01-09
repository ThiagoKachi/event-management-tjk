import { EventModel } from '@domain/models/event/event';

export interface CreateEventRepository {
  create (eventData: Omit<EventModel, 'id'>): Promise<EventModel>
}
