import { ImageStorageService } from '@domain/external/image-storage-service';
import axios from 'axios';

interface UploadPayload {
  file: Buffer;
  filename: string;
}

export class ExternalImageStorageServiceAdapter implements ImageStorageService {
  constructor(private readonly baseUrl: string) {}

  async upload<T>({ file, filename }: UploadPayload): Promise<T> {
    const formData = new FormData();

    const blob = new Blob([file], { type: 'image/png' });

    formData.append('file', blob, filename);

    const response = await axios.post<T>(
      this.baseUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}
