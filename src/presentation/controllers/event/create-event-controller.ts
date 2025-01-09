import { CreateEvent } from '@domain/usecases/event/create-event';
import { badRequest, created } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateEventValidator } from '@validation/validators/event/create-event-validation';
import { handleError } from 'src/utils/error-handler';
import { ValidationErrorAdapter } from 'src/utils/zod-error-adapter';

export class CreateEventController implements Controller {
  constructor (
    private readonly createEvent: CreateEvent,
    private readonly validation: CreateEventValidator,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error && !error.success && error.error.issues) {
        return badRequest(ValidationErrorAdapter.convert(error.error.issues));
      }

      const body = httpRequest.body;

      const event = await this.createEvent.create(body);

      return created(event);
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
