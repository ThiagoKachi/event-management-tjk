import { ConfirmarionOrderEmailModel } from '@domain/models/order/confirmation-order-email';

export interface EmailSender {
  send(emailInfo: ConfirmarionOrderEmailModel): Promise<void>
}
