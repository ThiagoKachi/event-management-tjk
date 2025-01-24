import { CreateEventRepository } from '@data/protocols/db/event/create-event';
import { LoadEventByIdRepository } from '@data/protocols/db/event/load-event-by-id';
import { LoadEventsRepository } from '@data/protocols/db/event/load-events';
import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
import { EventModel } from '@domain/models/event/event';
import { UpdateAvailableTicketsModel } from '@domain/models/event/update-available-tickets';
import { prismaClient } from '../prismaClient';

export class EventPrismaRepository implements CreateEventRepository, LoadEventsRepository, LoadEventByIdRepository, UpdateAvailableTicketsRepository {
  async updateAvailableTickets(data: UpdateAvailableTicketsModel): Promise<void> {
    await prismaClient.event.update({
      where: { id: data.id },
      data: { available: { decrement: data.quantity } },
    });
  }

  async loadById(id: string): Promise<EventModel | null> {
    const event = await prismaClient.event.findFirst({ where: { id } });

    return event;
  }

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
