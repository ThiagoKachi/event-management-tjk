import { LoadEventById } from '@domain/usecases/event/load-event-by-id';
import { notFound, ok } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class LoadEventByIdController implements Controller {
  constructor (
    private readonly loadEventById: LoadEventById,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const event = await this.loadEventById.loadById(id);

      if (!event) {
        return notFound('Event not found');
      }

      return ok(event);
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
