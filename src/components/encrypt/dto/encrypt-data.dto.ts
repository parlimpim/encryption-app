import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EncryptDataDto {
  @ApiProperty({
    example: 'example message',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(2000)
  payload: string;
}
