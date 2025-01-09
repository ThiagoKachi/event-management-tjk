import { LoadEventById } from '@domain/usecases/event/load-event-by-id';
import { serverError } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

export class LoadEventByIdController implements Controller {
  constructor (
    private readonly loadEventById: LoadEventById,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const event = await this.loadEventById.loadById(id);

      return {
        statusCode: 200,
        body: event,
      };
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
