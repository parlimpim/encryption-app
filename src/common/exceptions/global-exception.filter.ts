import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorCode } from '../enums/errorCode';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status: number;
    let errorCode: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorCode = this.getErrorCode(exception.getResponse());
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      successful: false,
      error_code: errorCode,
      data: null,
    });
  }

  getErrorCode(errorResponse: any) {
    if (typeof errorResponse === 'object') {
      return errorResponse.error;
    }
    return errorResponse;
  }
}
