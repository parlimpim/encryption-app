import { createMock } from '@golevelup/ts-jest';
import { ResponseInterceptor } from './response.interceptor';
import { DecryptDataDto } from 'src/models/encrypt/dto/decrypt-data.dto';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<DecryptDataDto>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should be defined', () => {
    expect(new ResponseInterceptor()).toBeDefined();
  });

  it('should return correct response format', async () => {
    const data: DecryptDataDto = {
      data1: 'encrypted key',
      data2: 'encrypted payload',
    };

    const context = createMock<ExecutionContext>();
    const handler = createMock<CallHandler>({
      handle: () => of(data),
    });

    const responseObservable = interceptor.intercept(context, handler);
    const response = await lastValueFrom(responseObservable);

    // should have successful, error_code and data propeties
    expect(response).toHaveProperty('successful');
    expect(response).toHaveProperty('error_code');
    expect(response).toHaveProperty('data');

    // successful should be true and should not have error_code
    expect(response.successful).toEqual(true);
    expect(response.error_code).toEqual('');
    expect(response.data).toEqual(data);
  });
});
