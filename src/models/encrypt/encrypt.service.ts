import { Injectable } from '@nestjs/common';
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
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@Injectable()
export class EncryptService {
  constructor() {}

  async encryptData(encryptDataDto: EncryptDataDto) {
    const { payload } = encryptDataDto;
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

    const response: DecryptDataDto = {
      data1: encryptedKeyString,
      data2: encryptedPayload,
    };
    return response;
  }

  async decryptData(decryptDataDto: DecryptDataDto) {
    const { data1: encryptedKeyString, data2: encryptedPayload } =
      decryptDataDto;
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

    const response: EncryptDataDto = { payload: decryptedPayload };
    return response;
  }
}
