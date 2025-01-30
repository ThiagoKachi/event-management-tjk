import { adaptRoute } from '@main/adapters/express-route-adapter';
import { makeChangeTicketStatusController } from '@main/factories/order/change-ticket-status-controller-repository';
import { makeCreateOrderController } from '@main/factories/order/create-order-controller-repository';
import { makeProcessOrderPaymentController } from '@main/factories/order/process-order-payment-controller-repository';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/orders/:id/confirm_payment', adaptRoute(makeProcessOrderPaymentController()));
  router.post('/orders', adaptRoute(makeCreateOrderController()));
  router.patch('/orders/:id/valid-ticket', adaptRoute(makeChangeTicketStatusController()));
};
