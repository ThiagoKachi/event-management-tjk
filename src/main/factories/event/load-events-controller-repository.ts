import { DbLoadEvents } from '@data/usecases/event/load-events';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { LoadEventsValidatorAdapter } from '@infra/validation/event/load-events-validation-adapter';
import { LoadEventsController } from '@presentation/controllers/event/load-events-controller';
import { Controller } from '@presentation/protocols';

export const makeLoadEventsController = (): Controller => {
  const eventRepository = new EventPrismaRepository();
  const loadEvents = new DbLoadEvents(eventRepository);

  const validation = new LoadEventsValidatorAdapter();

  return new LoadEventsController(loadEvents, validation);
};
