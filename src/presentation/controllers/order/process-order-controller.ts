import { ProcessOrder } from '@domain/usecases/order/process-order';
import { noContent } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class ProcessOrderController implements Controller {
  constructor (
    private readonly processOrder: ProcessOrder,
    private readonly orderId: string,
  ) {}

  async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.processOrder.process(this.orderId);

      return noContent();
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
