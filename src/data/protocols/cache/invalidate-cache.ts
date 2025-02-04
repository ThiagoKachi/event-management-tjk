export interface InvalidateCache {
  invalidate(key: string): Promise<void>;
}
