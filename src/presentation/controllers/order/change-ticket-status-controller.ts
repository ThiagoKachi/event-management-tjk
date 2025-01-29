import { ChangeTicketStatus } from '@domain/usecases/order/change-ticket-status';
import { ok } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class ChangeTicketStatusController implements Controller {
  constructor (
    private readonly changeTicketStatus: ChangeTicketStatus,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const order = await this.changeTicketStatus.changeStatus(id);

      return ok(order);
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
