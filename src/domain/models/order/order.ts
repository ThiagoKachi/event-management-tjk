export interface OrderModel {
  id: string;
  eventId: string;
  customer_email: string;
  quantity: number;
  total_amount: number;
  status: string;
  ticket_code: string;
  created_at: string;
}
