export interface ChangeTicketStatusRepository {
  changeTicketStatus(orderId: string): Promise<void>
}
