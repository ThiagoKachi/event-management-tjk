import { ValidationError } from '@domain/models/validation-error/validation';

export interface LoadEventsValidator {
  validate (name: string): void | ValidationError
}
