import { DbCreateEvent } from '@data/usecases/event/create-event';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { CreateEventValidatorAdapter } from '@infra/validation/event/create-event-validation-adapter';
import { CreateEventController } from '@presentation/controllers/event/create-event-controller';
import { Controller } from '@presentation/protocols';

export const makeCreateEventController = (): Controller => {
  const eventRepository = new EventPrismaRepository();
  const createEvent = new DbCreateEvent(eventRepository);

  const validator = new CreateEventValidatorAdapter();

  return new CreateEventController(createEvent, validator);
};
