import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DecryptDataDto {
  @ApiProperty({
    example: 'example data1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiProperty({
    example: 'example data2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  data2: string;
}
