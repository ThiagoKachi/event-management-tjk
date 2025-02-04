export interface DecrementCache {
  decrement(key: string, quantity: number): Promise<void>;
}
