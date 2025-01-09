import { EventModel } from '@domain/models/event/event';
import { ValidationError } from '@domain/models/validation-error/validation';

export interface CreateEventValidator {
  validate (data: Omit<EventModel, 'id'>): void | ValidationError
}
