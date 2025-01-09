
import { EventModel } from '@domain/models/event/event';
import { ValidationError } from '@domain/models/validation-error/validation';
import { CreateEventValidator } from '@validation/validators/event/create-event-validation';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class CreateEventValidatorAdapter implements CreateEventValidator {
  private createEventSchema = z.object({
    name: z.string().min(3, 'Event name is required').max(255),
    date: z.string().min(3, 'Event date is required').max(255),
    location: z.string().min(3, 'Event location is required').max(255),
    capacity: z.number().int().min(1, 'Event capacity is required'),
    available: z.number().int().min(1, 'Event available is required'),
    price: z.number().int().min(1, 'Event price is required'),
    status: z.string().min(3, 'Event status is required').max(255),
  });

  validate (data: EventModel): void | ValidationError {
    const result = this.createEventSchema.safeParse(data);

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
