export interface SuccessOrderEmailModel {
  order_id: string;
	customer_email: string;
	event_name: string;
	event_date: string;
	event_location: string;
	quantity: number;
	total_amount: string;
}
