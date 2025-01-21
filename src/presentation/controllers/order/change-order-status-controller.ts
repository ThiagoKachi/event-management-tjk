import { ProcessOrder } from '@domain/usecases/order/process-order';
import { noContent } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class ChangeOrderStatusController implements Controller {
  constructor (
    private readonly processOrder: ProcessOrder,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      await this.processOrder.orderInfo(id, 'paid');

      return noContent();
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
