import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeCreateOrderController } from '@main/factories/order/create-order-controller-repository';
import { makeProcessOrderController } from '@main/factories/order/process-order-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/orders/:id/confirm_payment', adaptRoute(makeProcessOrderController()));
  router.post('/orders', adaptRoute(makeCreateOrderController()));
};
