export interface ImageStorageService {
  upload<T>(payload: unknown, fileName?: string): Promise<T>;
}
