import { CreateOrderModel } from '@domain/models/order/create-order';
import { ValidationError } from '@domain/models/validation-error/validation';

export interface CreateOrderValidator {
  validate (data: CreateOrderModel): void | ValidationError
}
