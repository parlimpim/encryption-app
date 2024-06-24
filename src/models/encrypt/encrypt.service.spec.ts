import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { EncryptService } from './encrypt.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';

describe('EncryptService', () => {
  let service: EncryptService;
  const originalEnv = process.env;
  const algorithm = 'aes-256-ctr';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  const encryptedKey = Buffer.alloc(6);
  const encryptedKeyString = encryptedKey.toString('base64');
  const encrpytedPayload1 = 'encrypted';
  const encrpytedPayload2 = 'payload';
  const encrpytedPayload = encrpytedPayload1 + encrpytedPayload2;

  const decryptedPayload1 = 'example';
  const decryptedPayload2 = 'payload';
  const decryptedPayload = decryptedPayload1 + decryptedPayload2;

  beforeEach(() => {
    jest.spyOn(crypto, 'privateEncrypt').mockReturnValue(encryptedKey);
    jest.spyOn(crypto, 'createCipheriv').mockReturnValue(cipher);
    jest.spyOn(cipher, 'update').mockReturnValue(encrpytedPayload1);
    jest.spyOn(cipher, 'final').mockReturnValue(encrpytedPayload2);

    jest.spyOn(crypto, 'publicDecrypt').mockReturnValue(key);
    jest.spyOn(crypto, 'createDecipheriv').mockReturnValue(decipher);
    jest.spyOn(decipher, 'update').mockReturnValue(decryptedPayload1);
    jest.spyOn(decipher, 'final').mockReturnValue(decryptedPayload2);

    jest.resetModules();
    process.env = {
      ...originalEnv,
      CRYPTO_PASSWORD: 'password',
      CRYPTO_IV: 'iv',
      PRIVATE_KEY: 'private key',
      PUBLIC_KEY: 'public key',
      ALGORITHM: 'algorithm',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('encrypt data', async () => {
    const encryptDataDto: EncryptDataDto = {
      payload: decryptedPayload,
    };

    // encrypt data
    const result = await service.encryptData(encryptDataDto);

    // expect privateEncrypt to be called
    expect(crypto.privateEncrypt).toHaveBeenCalled();

    // cipher should be call
    expect(cipher.update).toHaveBeenCalled();
    expect(cipher.final).toHaveBeenCalled();

    // result should be the same
    expect(result.data1).toEqual(encryptedKeyString);
    expect(result.data2).toEqual(encrpytedPayload);
  });

  it('decrypt data', async () => {
    const decryptDataDto: DecryptDataDto = {
      data1: encryptedKeyString,
      data2: encrpytedPayload,
    };

    // decrypt data
    const result = await service.decryptData(decryptDataDto);

    // expect publicDecrypt to be called
    expect(crypto.publicDecrypt).toHaveBeenCalled();

    // decipher should be call
    expect(decipher.update).toHaveBeenCalled();
    expect(decipher.final).toHaveBeenCalled();

    // result should be the same
    expect(result.payload).toEqual(decryptedPayload);
  });
});
