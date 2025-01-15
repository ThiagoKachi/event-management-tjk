
import { CreateOrderModel } from '@domain/models/order/create-order';
import { ValidationError } from '@domain/models/validation-error/validation';
import { CreateOrderValidator } from '@validation/validators/order/create-order-validation';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class CreateOrderValidatorAdapter implements CreateOrderValidator {
  private createOrderSchema = z.object({
    eventId: z.string().min(3, 'Event id is required').max(255).uuid(),
    customer_email: z.string().min(3, 'Customer email is required').max(255).email(),
    quantity: z.number().min(1, 'Quantity must be greater than 0')
  });

  validate (data: CreateOrderModel): void | ValidationError {
    const result = this.createOrderSchema.safeParse(data);

    if (!result.success) {
      const validationError = fromZodError(result.error);
      return {
        success: false,
        name: 'ValidationError',
        message: validationError.message,
        error: {
          issues: result.error.issues
        }
      };
    }
  }
}
