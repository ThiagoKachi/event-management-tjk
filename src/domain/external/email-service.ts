export interface ApiEmailPort {
  send<T>(payload: unknown): Promise<T>;
}
