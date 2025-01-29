export interface ChangeTicketStatus {
  changeStatus(orderId: string): Promise<void>;
}
