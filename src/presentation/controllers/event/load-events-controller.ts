import { LoadEvents } from '@domain/usecases/event/load-events';
import { ValidationErrorAdapter } from '@infra/validation/adapters/zod-error-adapter';
import { badRequest, serverError } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { LoadEventsValidator } from '@validation/validators/event/load-events-validation';

export class LoadEventsController implements Controller {
  constructor (
    private readonly loadEvents: LoadEvents,
    private readonly validation: LoadEventsValidator,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error && !error.success && error.error.issues) {
        return badRequest(ValidationErrorAdapter.convert(error.error.issues));
      }

      const { name } = httpRequest.query;

      const events = await this.loadEvents.load(name);

      return {
        statusCode: 200,
        body: events,
      };
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
