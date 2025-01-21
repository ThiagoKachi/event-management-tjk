import { ChangeOrderStatus } from '@domain/usecases/order/change-order-status';
import { noContent } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { handleError } from 'src/utils/error-handler';

export class ChangeOrderStatusController implements Controller {
  constructor (
    private readonly changeOrderStatus: ChangeOrderStatus,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      await this.changeOrderStatus.changeStatus(id, 'paid');

      return noContent();
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
