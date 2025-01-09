import { CreateEventRepository } from '@data/protocols/db/event/create-event';
import { EventModel } from '@domain/models/event/event';
import { prismaClient } from '../prismaClient';

export class EventPrismaRepository implements CreateEventRepository {
  async create(eventData: Omit<EventModel, 'id'>): Promise<EventModel> {
    const event = await prismaClient.event.create({
      data: eventData,
    });

    return event;
  }
}
