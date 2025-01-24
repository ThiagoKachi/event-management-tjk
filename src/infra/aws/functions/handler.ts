import { makeProcessOrderController } from '@main/factories/order/process-order-controller-repository';
import type { SQSEvent } from 'aws-lambda';

exports.sqsHandler = async (event: SQSEvent) => {
  try {
    const orderId = JSON.parse(event.Records[0].body).orderId;

    const controller = makeProcessOrderController(orderId);

    await controller.handle({});
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
