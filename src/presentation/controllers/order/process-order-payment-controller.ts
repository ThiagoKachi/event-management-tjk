import { ProcessOrderPayment } from '@domain/usecases/order/process-order-payment';
import { noContent } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class ProcessOrderPaymentController implements Controller {
  constructor (
    private readonly processOrderPayment: ProcessOrderPayment,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      await this.processOrderPayment.orderInfo(id, 'paid');

      return noContent();
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
