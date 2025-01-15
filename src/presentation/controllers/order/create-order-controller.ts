import { CreateOrder } from '@domain/usecases/order/create-order';
import { badRequest, created } from '@presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { CreateOrderValidator } from '@validation/validators/order/create-order-validation';
import { handleError } from 'src/utils/error-handler';
import { ValidationErrorAdapter } from 'src/utils/zod-error-adapter';

export class CreateOrderController implements Controller {
  constructor (
    private readonly createOrder: CreateOrder,
    private readonly validation: CreateOrderValidator,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error && !error.success && error.error.issues) {
        return badRequest(ValidationErrorAdapter.convert(error.error.issues));
      }

      const body = httpRequest.body;

      const order = await this.createOrder.create(body);

      return created(order);
    } catch (error) {
      return handleError(error as Error);
    }
  }
}
