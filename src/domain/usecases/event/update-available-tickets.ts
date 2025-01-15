import { UpdateAvailableTicketsModel } from '@domain/models/event/update-available-tickets';

export interface UpdateAvailableTickets {
  updateAvailableTickets(data: UpdateAvailableTicketsModel): Promise<void>;
}
