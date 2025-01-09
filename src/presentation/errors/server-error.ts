import { CustomError } from './custom-error';

export class ServerError extends CustomError {
  constructor (message: string) {
    super(message, 500);
  }
}
