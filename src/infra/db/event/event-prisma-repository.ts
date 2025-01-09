import { CreateEventRepository } from '@data/protocols/db/event/create-event';
import { LoadEventsRepository } from '@data/protocols/db/event/load-events';
import { EventModel } from '@domain/models/event/event';
import { prismaClient } from '../prismaClient';

export class EventPrismaRepository implements CreateEventRepository, LoadEventsRepository {
  async load(name: string): Promise<EventModel[]> {
    const events = await prismaClient.event.findMany({ where: { name } });

    return events;
  }

  async create(eventData: Omit<EventModel, 'id'>): Promise<EventModel> {
    const event = await prismaClient.event.create({
      data: eventData,
    });

    return event;
  }
}
