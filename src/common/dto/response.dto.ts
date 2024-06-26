import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<TData> {
  @ApiProperty()
  successful: boolean;

  @ApiProperty()
  error_code: string;

  @ApiProperty()
  data?: TData;
}
