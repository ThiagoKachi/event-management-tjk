export interface ProcessOrder {
  processOrder(orderId: string, status: string): Promise<void>;
}
