import { ErrorFeedbackOrderEmailModel } from '@domain/models/order/error-feedback-order-email';

export interface ErrorFeedbackEmailSender {
  send(emailInfo: ErrorFeedbackOrderEmailModel): Promise<void>
}
