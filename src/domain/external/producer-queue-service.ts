export interface ProducerQueueService {
  send(payload: unknown): Promise<void>;
}
