import { GenerateQRCodeImage } from '@data/protocols/QRCode/generate-image';
import QRCode from 'qrcode';

export class QRCodeAdapter implements GenerateQRCodeImage {
  constructor () {}

  async generateImage(data: string): Promise<any> {
    const qrcode = await QRCode.toBuffer(data, { type: 'png' });

    return qrcode;
  }
}
