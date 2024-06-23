import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

export const ApiErrorResponse = ({
  status,
  errorCode,
  description,
  options,
}: {
  status: HttpStatus;
  errorCode: string;
  description?: string;
  options?: ApiResponseOptions;
}) => {
  return applyDecorators(
    ApiResponse({
      ...options,
      status,
      description,
      schema: {
        example: {
          successful: false,
          error_code: errorCode,
        },
        type: getSchemaPath(ResponseDto),
      },
    }),
  );
};
