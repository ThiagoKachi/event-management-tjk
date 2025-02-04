import { SuccessOrderEmailModel } from '@domain/models/order/success-order-email';

export interface SuccessOrderEmailSender {
  send(emailInfo: SuccessOrderEmailModel): Promise<void>
}
