export interface SendToQueueRepository {
  send(orderId: { orderId: string }): Promise<void>
}
