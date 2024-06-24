import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { EncryptService } from './encrypt.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';

import { ResponseDto } from 'src/common/dto/response.dto';
import { ApiCommonResponse } from 'src/common/decorators/common/common-response.decorator';
import { ApiErrorResponse } from 'src/common/decorators/common/error.decorator';
import { ErrorCode } from 'src/common/enums/errorCode';

@ApiTags('Encrypt')
@ApiExtraModels(ResponseDto)
@Controller('')
export class EncryptController {
  constructor(private encryptService: EncryptService) {}

  @Post('get-encrypt-data')
  @HttpCode(200)
  @ApiCommonResponse({
    status: HttpStatus.OK,
    model: DecryptDataDto,
    description: 'Success',
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCode.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBody({
    type: EncryptDataDto,
    description: 'Json structure for encrypt data',
  })
  async encrypt(@Body() encryptDataDto: EncryptDataDto) {
    return await this.encryptService.encryptData(encryptDataDto);
  }

  @Post('get-decrypt-data')
  @HttpCode(200)
  @ApiCommonResponse({
    status: HttpStatus.OK,
    model: EncryptController,
    description: 'Success',
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCode.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBody({
    type: DecryptDataDto,
    description: 'Json structure for decrypt data',
  })
  async decrypt(@Body() decryptDataDto: DecryptDataDto) {
    return await this.encryptService.decryptData(decryptDataDto);
  }
}
