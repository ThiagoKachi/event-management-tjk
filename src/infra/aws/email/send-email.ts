import { ApiEmailPort } from '@domain/external/email-service';
import axios from 'axios';

export class ExternalEmailServiceAdapter implements ApiEmailPort {
  constructor(private readonly baseUrl: string) {}

  async send<T>(payload: unknown): Promise<T> {
    const response = await axios.post<T>(
      this.baseUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  }
}
