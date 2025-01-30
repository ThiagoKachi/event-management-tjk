import { DbProcessOrder } from '@data/usecases/order/process-order';
import { QRCodeAdapter } from '@infra/QRCode/qrcode-adapter';
import { ExternalImageStorageServiceAdapter } from '@infra/aws/S3/upload-file';
import { ExternalEmailServiceAdapter } from '@infra/aws/email/send-email';
import { EventPrismaRepository } from '@infra/db/event/event-prisma-repository';
import { OrderPrismaRepository } from '@infra/db/order/order-prisma-repository';
import { ProcessOrderController } from '@presentation/controllers/order/process-order-controller';
import { Controller } from '@presentation/protocols';

export const makeProcessOrderController = (orderId: string): Controller => {
  const UPLOAD_S3_LAMBDA_URL = process.env.UPLOAD_S3_LAMBDA_URL;
  const EMAIL_URL = process.env.SUCCESS_EMAIL_LAMBDA_URL;

  const orderRepository = new OrderPrismaRepository();
  const eventRepository = new EventPrismaRepository();
  const qrCodeAdapter = new QRCodeAdapter();
  const externalImageStorageServiceAdapter = new ExternalImageStorageServiceAdapter(UPLOAD_S3_LAMBDA_URL!);
  const emailServiceAdapter = new ExternalEmailServiceAdapter(EMAIL_URL!);

  const processOrder = new DbProcessOrder(
    orderRepository,
    eventRepository,
    eventRepository,
    qrCodeAdapter,
    externalImageStorageServiceAdapter,
    emailServiceAdapter
  );

  return new ProcessOrderController(processOrder, orderId);
};
