export interface ProcessOrder {
  orderInfo(orderId: string, status: string): Promise<void>;
}
