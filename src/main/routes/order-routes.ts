import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeChangeOrderStatusController } from '@main/factories/order/change-order-status-controller-repository';
import { makeCreateOrderController } from '@main/factories/order/create-order-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/orders/:id/confirm_payment', adaptRoute(makeChangeOrderStatusController()));
  router.post('/orders', adaptRoute(makeCreateOrderController()));
};
