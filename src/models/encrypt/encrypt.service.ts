import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  randomBytes,
  scrypt,
  privateEncrypt,
  createDecipheriv,
  publicDecrypt,
  constants,
  createHash,
} from 'crypto';
import { promisify } from 'util';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@Injectable()
export class EncryptService {
  constructor() {}

  async encryptData(encryptDataDto: EncryptDataDto) {
    const { payload } = encryptDataDto;
    const iv = process.env.CRYPTO_IV;
    const password = process.env.CRYPTO_PASSWORD;
    const salt = randomBytes(16);
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    const encryptionIV = createHash('sha512')
      .update(iv)
      .digest('base64')
      .substring(0, 16);

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
    const cipher = createCipheriv('aes-256-ctr', key, encryptionIV);
    let encryptedPayload = cipher.update(payload, 'utf-8', 'base64');
    encryptedPayload += cipher.final('base64');

    const response: DecryptDataDto = {
      data1: encryptedKeyString,
      data2: encryptedPayload,
    };
    return response;
  }

  async decryptData(decryptDataDto: DecryptDataDto) {
    const { data1: encryptedKeyString, data2: encryptedPayload } =
      decryptDataDto;
    const iv = process.env.CRYPTO_IV;
    const encryptionIV = createHash('sha512')
      .update(iv)
      .digest('base64')
      .substring(0, 16);

    // decrypt key
    const decryptKey = publicDecrypt(
      {
        key: process.env.PUBLIC_KEY,
        padding: constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedKeyString, 'base64'),
    );

    // decrypt payload
    const decipher = createDecipheriv('aes-256-ctr', decryptKey, encryptionIV);
    let decryptedPayload = decipher.update(encryptedPayload, 'base64', 'utf-8');
    decryptedPayload += decipher.final('utf-8');

    const response: EncryptDataDto = { payload: decryptedPayload };
    return response;
  }
}
