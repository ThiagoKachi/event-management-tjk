export interface ProcessOrder {
  process(orderId: string): Promise<void>;
}
