import { UpdateAvailableTicketsModel } from '@domain/models/event/update-available-tickets';

export interface UpdateAvailableTicketsRepository {
  updateAvailableTickets(data: UpdateAvailableTicketsModel): Promise<void>;
}
