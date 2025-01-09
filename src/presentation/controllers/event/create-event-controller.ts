import { CreateEvent } from '@domain/usecases/event/create-event';
import { ValidationErrorAdapter } from '@infra/validation/adapters/zod-error-adapter';
import { badRequest, serverError } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateEventValidator } from '@validation/validators/event/create-event-validation';

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

      return {
        statusCode: 201,
        body: event,
      };
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
