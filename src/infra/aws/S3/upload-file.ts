import { ImageStorageService } from '@domain/external/image-storage-service';
import axios from 'axios';

export class ExternalImageStorageServiceAdapter implements ImageStorageService {
  constructor(private readonly baseUrl: string) {}

  async upload<T>(payload: unknown): Promise<T> {
    const response = await axios.post<T>(
      this.baseUrl,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}
