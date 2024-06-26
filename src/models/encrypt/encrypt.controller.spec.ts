import { Test, TestingModule } from '@nestjs/testing';
import { EncryptController } from './encrypt.controller';
import { EncryptService } from './encrypt.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';

describe('EncryptController', () => {
  let controller: EncryptController;

  const encryptService = {
    encryptData: jest.fn(),
    decryptData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptController],
      providers: [
        {
          provide: EncryptService,
          useValue: encryptService,
        },
      ],
    }).compile();

    controller = module.get<EncryptController>(EncryptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('encrypt', async () => {
    const encryptDataDto: EncryptDataDto = {
      payload: 'example payload',
    };

    const encryptedData: DecryptDataDto = {
      data1: 'encrypted key',
      data2: 'encrypted payload',
    };

    jest.spyOn(encryptService, 'encryptData').mockReturnValue(encryptedData);

    // encrypt
    const result = await controller.encrypt(encryptDataDto);

    // should return encrypted data
    expect(encryptService.encryptData).toHaveBeenCalledWith(encryptDataDto);
    expect(result).toEqual(encryptedData);
  });

  it('decrypt', async () => {
    const decryptDataDto: DecryptDataDto = {
      data1: 'encrypted key',
      data2: 'encrypted payload',
    };

    const decryptedDate: EncryptDataDto = {
      payload: 'example payload',
    };

    jest.spyOn(encryptService, 'decryptData').mockReturnValue(decryptedDate);

    // decrypt
    const result = await controller.decrypt(decryptDataDto);

    // should return decrypted data
    expect(encryptService.decryptData).toHaveBeenCalledWith(decryptDataDto);
    expect(result).toEqual(decryptedDate);
  });
});
