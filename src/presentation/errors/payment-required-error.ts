import { CustomError } from './custom-error';

export class PaymentRequiredError extends CustomError {
  constructor(message: string) {
    super(message, 402);
  }
}
