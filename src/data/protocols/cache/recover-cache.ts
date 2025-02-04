export interface RecoverCache {
  recover<T>(key: string): Promise<T | null>;
}
