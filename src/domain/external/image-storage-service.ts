export interface ImageStorageService {
  upload<T>(payload: unknown): Promise<T>;
}
