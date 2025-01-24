import { UpdateAvailableTicketsRepository } from '@data/protocols/db/event/update-available-tickets';
import { LoadOrderByIdRepository } from '@data/protocols/db/order/load-order-by-id';
import { GenerateQRCodeImage } from '@data/protocols/QRCode/generate-image';
import { ProcessOrder } from '@domain/usecases/order/process-order';
import { NotFoundError } from '@presentation/errors/not-found-error';
import { PaymentRequiredError } from '@presentation/errors/payment-required-error';

export class DbProcessOrder implements ProcessOrder {
  constructor(
    private readonly loadOrderByIdRepository: LoadOrderByIdRepository,
    private readonly updateAvailableTicketsRepository: UpdateAvailableTicketsRepository,
    private readonly generateQRCodeImage: GenerateQRCodeImage,
  ) {}

  async process(orderId: string): Promise<void> {
    const order = await this.loadOrderByIdRepository.loadById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    if (order.status !== 'paid') {
      throw new PaymentRequiredError('The order must be paid to be processed.');
    }

    const qrCodeImage = await this.generateQRCodeImage
      .generateImage(`${process.env.APPLICATION_URL}/${order.id}`);

    console.log(qrCodeImage, 'Manda pro S3');

    await this.updateAvailableTicketsRepository
      .updateAvailableTickets({ id: order?.eventId, quantity: order?.quantity });
  }
}

// Fazer useCase "process-order", recebe o orderId ✅
// Verifica se foi paga ✅
// Se sim: Gera o QRCode ✅
// Salva no S3
// Confirma a venda e decrementa no banco ✅
// Envia email para o cliente com os dados do pedido e QRCode

// Separar em lambas menores (Processar a order, Gerar QRCode e Salvar no S3, Enviar email)
// Mudar "ticket_code" para "ticket_status" e quando ler o QRCode, mudar para "used"
// Redis e Gateway de pagamento
// Fazer ingressos nominais e gerar um QRCode por ingresso
// Configurar banco de dados online para usar
