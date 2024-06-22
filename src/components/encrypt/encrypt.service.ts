import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt, privateEncrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  async encryptData(payload: string) {
    const salt = randomBytes(16);
    const iv = randomBytes(16);
    const password = this.configService.get<string>('CRYPTO_PASSWORD');
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    // encrypt payload
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    let encryptedPayload = cipher.update(payload, 'utf8', 'base64');
    encryptedPayload += cipher.final('base64');

    // encrypt key
    const encryptedKey = privateEncrypt(
      this.configService.get<string>('PRIVATE_KEY'),
      Buffer.from(key),
    );
    const encryptedKeyString = encryptedKey.toString('base64');

    return { data1: encryptedPayload, data2: encryptedKeyString };
    // create aes key
    // encrypt payload by aes key
    // encrypt aes key by private key
    // return both of them
  }

  async decrypt() {}
}
