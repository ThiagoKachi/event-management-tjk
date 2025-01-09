import { DbLoadEventById } from '@data/usecases/event/load-event-by-id';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { LoadEventByIdController } from '@presentation/controllers/event/load-event-by-id-controller';
import { Controller } from '@presentation/protocols';

export const makeLoadEventByIdController = (): Controller => {
  const eventRepository = new EventPrismaRepository();
  const loadEventById = new DbLoadEventById(eventRepository);

  return new LoadEventByIdController(loadEventById);
};
