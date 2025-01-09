import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeCreateEventController } from '@main/factories/event/create-event-controller-repository';
import { makeLoadEventsController } from '@main/factories/event/load-events-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.get('/events', adaptRoute(makeLoadEventsController()));
  router.post('/events', adaptRoute(makeCreateEventController()));
};
