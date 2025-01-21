export interface ChangeOrderStatusRepository {
  changeStatus(orderId: string, status: string): Promise<void>
}
