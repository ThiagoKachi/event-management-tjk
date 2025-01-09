
import { ValidationError } from '@domain/models/validation-error/validation';
import { LoadEventsValidator } from '@validation/validators/event/load-events-validation';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class LoadEventsValidatorAdapter implements LoadEventsValidator {
  private loadEventsSchema = z.object({
    name: z.string({ message: 'Event name must be a string' }).optional(),
  });

  validate (name: string): void | ValidationError {
    const result = this.loadEventsSchema.safeParse(name);

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
