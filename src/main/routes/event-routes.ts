import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeCreateEventController } from '@main/factories/event/create-event-controller-repository';
import { makeLoadEventByIdController } from '@main/factories/event/load-event-by-id-controller-repository';
import { makeLoadEventsController } from '@main/factories/event/load-events-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.get('/events', adaptRoute(makeLoadEventsController()));
  router.get('/events/:id', adaptRoute(makeLoadEventByIdController()));
  router.post('/events', adaptRoute(makeCreateEventController()));
};
