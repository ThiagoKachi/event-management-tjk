import { ConfirmarionOrderEmailModel } from '@domain/models/order/confirmation-order-email';

export interface ConfirmationOrderEmail {
  confirm(orderBody: ConfirmarionOrderEmailModel): Promise<void>;
}
