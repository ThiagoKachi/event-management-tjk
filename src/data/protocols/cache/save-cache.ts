export interface SaveCache {
  save<T>(key: string, value: T, ttl?: number): Promise<void>;
}
