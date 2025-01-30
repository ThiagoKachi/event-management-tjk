import { SuccessOrderEmailModel } from '@domain/models/order/confirmation-order-email copy';

export interface SuccessOrderEmailSender {
  send(emailInfo: SuccessOrderEmailModel): Promise<void>
}
