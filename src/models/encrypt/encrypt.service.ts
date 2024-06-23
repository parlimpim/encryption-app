import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  randomBytes,
  scrypt,
  privateEncrypt,
  createDecipheriv,
  publicDecrypt,
  constants,
} from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  async encryptData(payload: string) {
    const salt = randomBytes(16);
    const iv = Buffer.from(process.env.CRYPTO_IV, 'base64');
    const password = process.env.CRYPTO_PASSWORD;
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    // encrypt key
    const encryptedKey = privateEncrypt(
      {
        key: process.env.PRIVATE_KEY,
        padding: constants.RSA_PKCS1_PADDING,
      },
      key,
    );
    const encryptedKeyString = encryptedKey.toString('base64');

    // encrypt payload
    const cipher = createCipheriv(process.env.ALGORITHM, key, iv);
    let encryptedPayload = cipher.update(payload, 'utf8', 'base64');
    encryptedPayload += cipher.final('base64');

    return { data1: encryptedKeyString, data2: encryptedPayload };
  }

  async decryptData(encryptedKeyString: string, encryptedPayload: string) {
    const iv = Buffer.from(process.env.CRYPTO_IV, 'base64');

    // decrypt key
    const decryptKey = publicDecrypt(
      {
        key: process.env.PUBLIC_KEY,
        padding: constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedKeyString, 'base64'),
    );

    // decrypt payload
    const decipher = createDecipheriv(process.env.ALGORITHM, decryptKey, iv);
    let decryptedPayload = decipher.update(encryptedPayload, 'base64', 'utf8');
    decryptedPayload += decipher.final('utf8');
    return { payload: decryptedPayload };
  }
}
