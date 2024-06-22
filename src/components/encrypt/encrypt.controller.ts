import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncryptService } from './encrypt.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@ApiTags('Encrypt')
@Controller('')
export class EncryptController {
  constructor(private encryptService: EncryptService) {}

  @Post('get-encrypt-data')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: EncryptDataDto,
    description: 'Json structure for encrypt data object',
  })
  encrypt(@Body() encryptDataDto: EncryptDataDto) {
    return this.encryptService.encryptData(encryptDataDto.payload);
  }
}
