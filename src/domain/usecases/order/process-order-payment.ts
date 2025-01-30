export interface ProcessOrderPayment {
  orderInfo(orderId: string, status: string): Promise<void>;
}
