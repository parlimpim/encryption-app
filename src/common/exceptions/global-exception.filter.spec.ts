import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('should be defined', () => {
    expect(new GlobalExceptionFilter()).toBeDefined();
  });

  it('should catch http exception', () => {
    const BAD_REQUEST = 'Bad Request';

    filter.catch(
      new HttpException(BAD_REQUEST, HttpStatus.BAD_REQUEST),
      mockArgumentsHost,
    );

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      successful: false,
      error_code: BAD_REQUEST,
      data: null,
    });
  });

  it('other exceptions', () => {
    const INTERNAL_SERVER_ERROR = 'Internal Server Error';

    filter.catch(new Error(INTERNAL_SERVER_ERROR), mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      successful: false,
      error_code: INTERNAL_SERVER_ERROR,
      data: null,
    });
  });
});
