import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeCreateOrderController } from '@main/factories/order/create-order-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/orders', adaptRoute(makeCreateOrderController()));
};
